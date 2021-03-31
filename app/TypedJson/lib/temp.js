'use strict'

// Stores 2^i from i=0 to i=56
var POW = (function () {
  var r = [],
    i, n = 1
  for (i = 0; i <= 56; i++) {
    r.push(n)
    n *= 2
  }
  return r
})()

// Pre-calculated constants
var MAX_DOUBLE_INT = POW[53],
  MAX_UINT8 = POW[7],
  MAX_UINT16 = POW[14],
  MAX_UINT32 = POW[29],
  MAX_INT8 = POW[6],
  MAX_INT16 = POW[13],
  MAX_INT32 = POW[28]

var types = {}

types['uint'] = {
  write: function (u, data, path) {
    // Check the input
    if (Math.round(u) !== u || u > MAX_DOUBLE_INT || u < 0) {
      throw new TypeError('Expected unsigned integer at ' + path + ', got ' + u)
    }

    if (u < MAX_UINT8) {
      data.writeUInt8(u)
    } else if (u < MAX_UINT16) {
      data.writeUInt16(u + 0x8000)
    } else if (u < MAX_UINT32) {
      data.writeUInt32(u + 0xc0000000)
    } else {
      // Split in two 32b uints
      data.writeUInt32(Math.floor(u / POW[32]) + 0xe0000000)
      data.writeUInt32(u >>> 0)
    }
  },
  read: function (state) {
    var firstByte = state.peekUInt8()

    if (!(firstByte & 0x80)) {
      state._offset++
      return firstByte
    } else if (!(firstByte & 0x40)) {
      return state.readUInt16() - 0x8000
    } else if (!(firstByte & 0x20)) {
      return state.readUInt32() - 0xc0000000
    } else {
      return (state.readUInt32() - 0xe0000000) * POW[32] + state.readUInt32()
    }
  }
}

types['int'] = {
  write: function (i, data, path) {
    // Check the input
    if (Math.round(i) !== i || i > MAX_DOUBLE_INT || i < -MAX_DOUBLE_INT) {
      throw new TypeError('Expected signed integer at ' + path + ', got ' + i)
    }

    if (i >= -MAX_INT8 && i < MAX_INT8) {
      data.writeUInt8(i & 0x7f)
    } else if (i >= -MAX_INT16 && i < MAX_INT16) {
      data.writeUInt16((i & 0x3fff) + 0x8000)
    } else if (i >= -MAX_INT32 && i < MAX_INT32) {
      data.writeUInt32((i & 0x1fffffff) + 0xc0000000)
    } else {
      // Split in two 32b uints
      data.writeUInt32((Math.floor(i / POW[32]) & 0x1fffffff) + 0xe0000000)
      data.writeUInt32(i >>> 0)
    }
  },
  read: function (state) {
    var firstByte = state.peekUInt8(),
      i

    if (!(firstByte & 0x80)) {
      state._offset++
      return (firstByte & 0x40) ? (firstByte | 0xffffff80) : firstByte
    } else if (!(firstByte & 0x40)) {
      i = state.readUInt16() - 0x8000
      return (i & 0x2000) ? (i | 0xffffc000) : i
    } else if (!(firstByte & 0x20)) {
      i = state.readUInt32() - 0xc0000000
      return (i & 0x10000000) ? (i | 0xe0000000) : i
    } else {
      i = state.readUInt32() - 0xe0000000
      i = (i & 0x10000000) ? (i | 0xe0000000) : i
      return i * POW[32] + state.readUInt32()
    }
  }
};

types['float'] = {
  write: function (f, data, path) {
    if (typeof f !== 'number') {
      throw new TypeError('Expected a number at ' + path + ', got ' + f)
    }
    data.writeDouble(f)
  },
  read: function (state) {
    return state.readDouble()
  }
};

types['string'] = {
  write: function (s, data, path) {
    if (typeof s !== 'string') {
      throw new TypeError('Expected a string at ' + path + ', got ' + s)
    }

    exports.Buffer.write(new Buffer(s), data, path)
  },
  read: function (state) {
    return exports.Buffer.read(state).toString()
  }
};

types['Buffer'] = {
  write: function (B, data, path) {
    if (!Buffer.isBuffer(B)) {
      throw new TypeError('Expected a Buffer at ' + path + ', got ' + B)
    }
    exports.uint.write(B.length, data, path)
    data.appendBuffer(B)
  },
  read: function (state) {
    var length = exports.uint.read(state)
    return state.readBuffer(length)
  }
};

types['boolean'] = {
  write: function (b, data, path) {
    if (typeof b !== 'boolean') {
      throw new TypeError('Expected a boolean at ' + path + ', got ' + b)
    }
    data.writeUInt8(b ? 1 : 0)
  },
  read: function (state) {
    var b = state.readUInt8()
    if (b > 1) {
      throw new Error('Invalid boolean value')
    }
    return Boolean(b)
  }
};

types['json'] = {
  write: function (j, data, path) {
    exports.string.write(JSON.stringify(j), data, path)
  },
  read: function (state) {
    return JSON.parse(exports.string.read(state))
  }
};

types['oid'] = {
  write: function (o, data, path) {
    var buffer = new Buffer(String(o), 'hex')
    if (buffer.length !== 12) {
      throw new TypeError('Expected an object id (12 bytes) at ' + path + ', got ' + o)
    }
    data.appendBuffer(buffer)
  },
  read: function (state) {
    return state.readBuffer(12).toString('hex')
  }
};

types['regex'] = {
  write: function (r, data, path) {
    var g, i, m
    if (!(r instanceof RegExp)) {
      throw new TypeError('Expected an instance of RegExp at ' + path + ', got ' + r)
    }
    exports.string.write(r.source, data, path)
    g = r.global ? 1 : 0
    i = r.ignoreCase ? 2 : 0
    m = r.multiline ? 4 : 0
    data.writeUInt8(g + i + m)
  },
  read: function (state) {
    var source = exports.string.read(state),
      flags = state.readUInt8(),
      g = flags & 0x1 ? 'g' : '',
      i = flags & 0x2 ? 'i' : '',
      m = flags & 0x4 ? 'm' : ''
    return new RegExp(source, g + i + m)
  }
};

types['date'] = {
  write: function (d, data, path) {
    if (!(d instanceof Date)) {
      throw new TypeError('Expected an instance of Date at ' + path + ', got ' + d)
    } else if (isNaN(d.getTime())) {
      throw new TypeError('Expected a valid Date at ' + path + ', got ' + d)
    }
    exports.uint.write(d.getTime(), data, path)
  },
  read: function (state) {
    return new Date(exports.uint.read(state))
  }
};


/**
 * A mutable-length write-only Buffer
 * @class
 * @param {number} [capacity=128] - initial Buffer size
 */
function Data(capacity) {
  /**
   * Internal buffer
   * @member {Buffer}
   * @private
   */
  this._buffer = new Buffer(capacity || 128)

  /**
   * Number of used bytes
   * @member {number}
   * @private
   */
  this._length = 0
}

/**
 * @param {Buffer} data
 */
Data.prototype.appendBuffer = function (data) {
  this._alloc(data.length)
  data.copy(this._buffer, this._length)
  this._length += data.length
}

/**
 * @param {number} value
 */
Data.prototype.writeUInt8 = function (value) {
  this._alloc(1)
  this._buffer.writeUInt8(value, this._length)
  this._length++
}

/**
 * @param {number} value
 */
Data.prototype.writeUInt16 = function (value) {
  this._alloc(2)
  this._buffer.writeUInt16BE(value, this._length)
  this._length += 2
}

/**
 * @param {number} value
 */
Data.prototype.writeUInt32 = function (value) {
  this._alloc(4)
  this._buffer.writeUInt32BE(value, this._length)
  this._length += 4
}

/**
 * @param {number} value
 */
Data.prototype.writeDouble = function (value) {
  this._alloc(8)
  this._buffer.writeDoubleBE(value, this._length)
  this._length += 8
}

/**
 * Return the data as a Buffer.
 * Note: the returned Buffer and the internal Buffer share the same memory
 * @return {Buffer}
 */
Data.prototype.toBuffer = function () {
  return this._buffer.slice(0, this._length)
}

/**
 * Alloc the given number of bytes
 * @param {number} bytes
 * @private
 */
Data.prototype._alloc = function (bytes) {
  var buffLen = this._buffer.length,
    newBuffer

  if (this._length + bytes > buffLen) {
    do {
      buffLen *= 2
    } while (this._length + bytes > buffLen)

    newBuffer = new Buffer(buffLen)
    this._buffer.copy(newBuffer, 0, 0, this._length)
    this._buffer = newBuffer
  }
}

'use strict'

/**
 * Wraps a buffer with a read head pointer
 * @class
 * @param {Buffer} buffer
 */
function ReadState(buffer) {
  /**
   * @member {Buffer}
   * @private
   */
  this._buffer = buffer
  /**
   * @member {number}
   * @private
   */
  this._offset = 0
}

/**
 * Read one byte but don't advance the read pointer
 * @returns {number}
 */
ReadState.prototype.peekUInt8 = function () {
  return this._buffer.readUInt8(this._offset)
}

/**
 * Read one byte and advance the read pointer
 * @returns {number}
 */
ReadState.prototype.readUInt8 = function () {
  return this._buffer.readUInt8(this._offset++)
}

/**
 * @returns {number}
 */
ReadState.prototype.readUInt16 = function () {
  var r = this._buffer.readUInt16BE(this._offset)
  this._offset += 2
  return r
}

/**
 * @returns {number}
 */
ReadState.prototype.readUInt32 = function () {
  var r = this._buffer.readUInt32BE(this._offset)
  this._offset += 4
  return r
}

/**
 * @returns {number}
 */
ReadState.prototype.readDouble = function () {
  var r = this._buffer.readDoubleBE(this._offset)
  this._offset += 8
  return r
}

/**
 * @param {number} length
 * @returns {Buffer}
 */
ReadState.prototype.readBuffer = function (length) {
  if (this._offset + length > this._buffer.length) {
    throw new RangeError('Trying to access beyond buffer length')
  }
  var r = this._buffer.slice(this._offset, this._offset + length)
  this._offset += length
  return r
}

/**
 * @return {boolean}
 */
ReadState.prototype.hasEnded = function () {
  return this._offset === this._buffer.length
}


/**
 * Create a type, given the format. The format can be either:
 * * A basic type, one of:
 *     `'uint', 'int', 'float', 'string', 'Buffer', 'boolean', 'json', 'oid', 'regex', 'date'`
 * * A compound type: an object, like:
 *     `{a: 'int', b: ['int'], c: [{'d?': 'string'}]}`
 * In the example above, 'b' is a an array of integers, 'd' is an optional field
 * * An array of values of the same type:
 *     `['int']`
 * @class
 * @param {string|Object|Array} type
 */
function Type(type) {
  /**
   * @member {Type.TYPE} Type#type
   */
  /**
   * Defined fields in an `OBJECT` type
   * @member {?Array<Field>} Type#fields
   */
  /**
   * Elements type for an `ARRAY` type
   * @member {?Type} Type#subType
   */

  if (typeof type === 'string') {
    if (type in Type.TYPE && type !== Type.TYPE.ARRAY && type !== Type.TYPE.OBJECT) {
      throw new TypeError('Unknown basic type: ' + type)
    }

    this.type = type
  } else if (Array.isArray(type)) {
    if (type.length !== 1) {
      throw new TypeError('Invalid array type, it must have exactly one element')
    }

    this.type = Type.TYPE.ARRAY
    this.subType = new Type(type[0])
  } else {
    if (!type || typeof type !== 'object') {
      throw new TypeError('Invalid type: ' + type)
    }

    this.type = Type.TYPE.OBJECT
    this.fields = Object.keys(type).map(function (name) {
      return new Field(name, type[name])
    })
  }
}

/**
 * Parse and represent an object field. See example in Type.js
 * @class
 * @param {string} name
 * @param {string|Object|Array<string>|Array<Object>} type
 */
function Field(name, type) {
  /** @member {boolean} */
  this.optional = false

  if (name[name.length - 1] === '?') {
    this.optional = true
    name = name.substr(0, name.length - 1)
  }

  /** @member {string} */
  this.name = name

  /** @member {boolean} */
  this.array = Array.isArray(type)

  if (this.array) {
    if (type.length !== 1) {
      throw new TypeError('Invalid array type, it must have exactly one element')
    }
    type = type[0]
  }

  /** @member {Type} */
  this.type = new Type(type)
}


/**
 * All possible types
 * @enum {string}
 */
Type.TYPE = {
  UINT: 'uint',
  INT: 'int',
  FLOAT: 'float',
  STRING: 'string',
  BUFFER: 'Buffer',
  BOOLEAN: 'boolean',
  JSON: 'json',
  OID: 'oid',
  REGEX: 'regex',
  DATE: 'date',
  ARRAY: '[array]',
  OBJECT: '{object}'
}

/**
 * Expose all scalar types (see types.js)
 * @property {Object<Function>}
 */
Type.types = Type.prototype.types = types

/**
 * @param {*} value
 * @return {Buffer}
 * @throws if the value is invalid
 */
Type.prototype.encode = function (value) {
  var data = new Data
  this.write(value, data, '')
  return data.toBuffer()
}

/**
 * @param {Buffer} buffer
 * @return {*}
 * @throws if fails
 */
Type.prototype.decode = function (buffer) {
  return this.read(new ReadState(buffer))
}

/**
 * @param {*} value
 * @param {Data} data
 * @param {string} path
 * @throws if the value is invalid
 */
Type.prototype.write = function (value, data, path) {
  var i, field, subpath, subValue, len

  if (this.type === Type.TYPE.ARRAY) {
    // Array field
    return this._writeArray(value, data, path, this.subType)
  } else if (this.type !== Type.TYPE.OBJECT) {
    // Simple type
    return types[this.type].write(value, data, path)
  }

  // Check for object type
  if (!value || typeof value !== 'object') {
    throw new TypeError('Expected an object at ' + path)
  }

  // Write each field
  for (i = 0, len = this.fields.length; i < len; i++) {
    field = this.fields[i]
    subpath = path ? path + '.' + field.name : field.name
    subValue = value[field.name]

    if (field.optional) {
      // Add 'presence' flag
      if (subValue === undefined || subValue === null) {
        types.boolean.write(false, data)
        continue
      } else {
        types.boolean.write(true, data)
      }
    }

    if (!field.array) {
      // Scalar field
      field.type.write(subValue, data, subpath)
      continue
    }

    // Array field
    this._writeArray(subValue, data, subpath, field.type)
  }
}

/**
 * @param {*} value
 * @param {Data} data
 * @param {string} path
 * @param {Type} type
 * @throws if the value is invalid
 * @private
 */
Type.prototype._writeArray = function (value, data, path, type) {
  var i, len
  if (!Array.isArray(value)) {
    throw new TypeError('Expected an Array at ' + path)
  }
  len = value.length
  types.uint.write(len, data)
  for (i = 0; i < len; i++) {
    type.write(value[i], data, path + '.' + i)
  }
}

/**
 * This funciton will be executed only the first time
 * After that, we'll compile the read routine and add it directly to the instance
 * @param {ReadState} state
 * @return {*}
 * @throws if fails
 */
Type.prototype.read = function (state) {
  this.read = this._compileRead()
  return this.read(state)
}

/**
 * Return a signature for this type. Two types that resolve to the same hash can be said as equivalents
 * @return {Buffer}
 */
Type.prototype.getHash = function () {
  var hash = new Data
  hashType(this, false, false)
  return hash.toBuffer()

  /**
   * @param {Type} type
   * @param {boolean} array
   * @param {boolean} optional
   */
  function hashType(type, array, optional) {
    // Write type (first char + flags)
    // AOxx xxxx
    hash.writeUInt8((type.type.charCodeAt(0) & 0x3f) | (array ? 0x80 : 0) | (optional ? 0x40 : 0))

    if (type.type === Type.TYPE.ARRAY) {
      hashType(type.subType, false, false)
    } else if (type.type === Type.TYPE.OBJECT) {
      types.uint.write(type.fields.length, hash)
      type.fields.forEach(function (field) {
        hashType(field.type, field.array, field.optional)
      })
    }
  }
}

/**
 * Compile the decode method for this object
 * @return {function(ReadState):*}
 * @private
 */
Type.prototype._compileRead = function () {
  if (this.type !== Type.TYPE.OBJECT && this.type !== Type.TYPE.ARRAY) {
    // Scalar type
    // In this case, there is no need to write custom code
    return types[this.type].read
  } else if (this.type === Type.TYPE.ARRAY) {
    return this._readArray.bind(this, this.subType)
  }

  // As an example, compiling code to new Type({a:'int', 'b?':['string']}) will result in:
  // return {
  //     a: this.fields[0].type.read(state),
  //     b: this.types.boolean.read(state) ? this._readArray(state, this.fields[1].type) : undefined
  // }
  var code = 'return {' + this.fields.map(function (field, i) {
    var name = JSON.stringify(field.name),
      fieldStr = 'this.fields[' + i + ']',
      readCode, code

    if (field.array) {
      readCode = 'this._readArray(' + fieldStr + '.type, state)'
    } else {
      readCode = fieldStr + '.type.read(state)'
    }

    if (!field.optional) {
      code = name + ': ' + readCode
    } else {
      code = name + ': this.types.boolean.read(state) ? ' + readCode + ' : undefined'
    }
    return code
  }).join(',') + '}'

  return new Function('state', code)
}

/**
 * @param {Type} type
 * @param {ReadState} state
 * @return {Array}
 * @throws - if invalid
 * @private
 */
Type.prototype._readArray = function (type, state) {
  var arr = new Array(types.uint.read(state)),
    j
  for (j = 0; j < arr.length; j++) {
    arr[j] = type.read(state)
  }
  return arr
}