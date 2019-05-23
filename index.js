/**********************************************************************
 * .___________..______          ___   .___________.  ______  __    __       ___   .___________.
 * |           ||   _  \        /   \  |           | /      ||  |  |  |     /   \  |           |
 * `---|  |----`|  |_)  |      /  ^  \ `---|  |----`|  ,----'|  |__|  |    /  ^  \ `---|  |----`
 *     |  |     |      /      /  /_\  \    |  |     |  |     |   __   |   /  /_\  \    |  |
 *     |  |     |  |\  \----./  _____  \   |  |     |  `----.|  |  |  |  /  _____  \   |  |
 *     |__|     | _| `._____/__/     \__\  |__|      \______||__|  |__| /__/     \__\  |__|
 *
 * Program name      : Tratchat Sha256
 *
 * Author            : Ryan Trattner
 *
 * Date created      : May 23, 2019
 *
 * License           : MIT (included below)
 *
 *
 * ----
 *
 *
 * MIT License
 *
 * Copyright (c) 2019 Ryan Trattner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 ***********************************************************************/



var Sha256 = (function() {


  function hash(message, options) {
    if (options && options.async) {
      return new Promise(function(resolve, reject) {
        resolve(doHash(message))
      });
    } else {
      return doHash(message);
    }
  }



  function doHash(message) {
    if (message == undefined) {
      throw ("SHA256: The message parameter cannot be undefined.")
    }

    const K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    var messageBin = stringToBinary(message);
    //  verbose("messageBinary = " + messageBin)
    var l = messageBin.length;
    //    verbose("L = " + l)

    messageBin.push(0x1)


    k = 0;

    for (var kTest = 0;; kTest++) {
      if (((l + 1 + kTest) % 512) == (448 % 512)) {
        k = kTest;
        break;
      }
    }

    //    verbose("K = " + k)

    for (var i = 0; i < k; i++) {
      messageBin.push(0x0)
    }


    //Calculate the length in binary
    var tempLengthBinary = l.toString(2).split('')

    var lengthBinary = [];
    for (var i = 0; i < tempLengthBinary.length; i++) {
      lengthBinary.push(+tempLengthBinary[i])
    }

    //  verbose("L in binary is  = " + lengthBinary)

    for (var i = 0; i < 64 - lengthBinary.length; i++) {
      messageBin.push(0x0)
    }
    for (var i = 0; i < lengthBinary.length; i++) {
      messageBin.push(lengthBinary[i])
    }
    //  verbose("Full Padded message is  = " + messageBin)

    const N = messageBin.length / 512;

    //    verbose("The Value of N is = " + N)


    var M = splitUp(messageBin, N)

    var amountToSplit = M[0].length / 32;
    //  verbose(M)
    for (var i = 0; i < M.length; i++) {
      M[i] = splitUp(M[i], amountToSplit)
      for (var x = 0; x < M[i].length; x++) {
        M[i][x] = M[i][x].join("")
        M[i][x] = parseInt(M[i][x], 2);
      }

    }


    //  verbose("M is equal to = ")
    //    verbose(M)

    var H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    for (var i = 0; i < N; i++) {
      //    verbose("-------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
      //    verbose("BLOCK #" + i)
      //    verbose("-------------------------------------------------------------------------------------------------------------------------------------------------------------------------")

      var W = new Array(64);

      for (var t = 0; t < 16; t++) {
        W[t] = M[i][t];
        //      verbose("W[" + t + "]" + " = " + W[t])
      }
      for (var t = 16; t < 64; t++) {
        W[t] = (σ1(W[t - 2]) + W[t - 7] + σ0(W[t - 15]) + W[t - 16]) >>> 0;
        //    verbose("W[" + t + "]" + " = " + W[t])
      }

      var a = H[0]
      var b = H[1]
      var c = H[2]
      var d = H[3]
      var e = H[4]
      var f = H[5]
      var g = H[6]
      var h = H[7]
      //    verbose("T           a                  b                c                 d                 e                 f                 g                 h")
      //    verbose("-------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
      for (var t = 0; t < 64; t++) {
        T1 = h + Σ1(e) + Ch(e, f, g) + K[t] + W[t];
        T2 = Σ0(a) + Maj(a, b, c);
        h = g;
        g = f;
        f = e;
        e = (d + T1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (T1 + T2) >>> 0;
        //      verbose("#" + t + "          " + a.toString(16) + "          " + b.toString(16) + "          " + c.toString(16) + "          " + d.toString(16) + "         " + e.toString(16) + "          " + f.toString(16) + "          " + g.toString(16) + "          " + h.toString(16) + "")
      }

      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;

    }

    for (let h = 0; h < H.length; h++) {
      H[h] = ('00000000' + H[h].toString(16)).slice(-8);
    }
    return H.join("");
    /*
        function verbose(message) {
          if (options) {
            if (options.verbose) {
              options.verbose(message)
            }
          }
        }
        */
  }

  function ROTR(n, x) {
    return (x >>> n) | (x << (32 - n));
  }

  function Σ0(x) {
    return ROTR(2, x) ^ ROTR(13, x) ^ ROTR(22, x);
  }

  function Σ1(x) {
    return ROTR(6, x) ^ ROTR(11, x) ^ ROTR(25, x);
  }

  function σ0(x) {
    return ROTR(7, x) ^ ROTR(18, x) ^ (x >>> 3);
  }

  function σ1(x) {
    return ROTR(17, x) ^ ROTR(19, x) ^ (x >>> 10);
  }

  function Ch(x, y, z) {
    return (x & y) ^ (~x & z);
  }

  function Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  function stringToBinary(string) {
    var result = "";
    for (var i = 0; i < string.length; i++) {
      var bin = string[i].charCodeAt().toString(2);
      result += Array(8 - bin.length + 1).join("0") + bin;
    }
    var array = result.split('')
    var newArray = []
    for (var i = 0; i < array.length; i++) {
      newArray.push(+array[i])
    }
    return newArray;
  }

  function binaryToString(binaryArray) {
    var responseTxt = ''
    for (var i = 0; i + 7 <= binaryArray.length; i += 8) {
      var currentBinary = "" + binaryArray[i] + "" + binaryArray[i + 1] + "" + binaryArray[i + 2] + "" + binaryArray[i + 3] + "" + binaryArray[i + 4] + "" + binaryArray[i + 5] + "" + binaryArray[i + 6] + "" + binaryArray[i + 7] + ""
      //console.log(currentBinary)
      var result = "";
      var arr = currentBinary.match(/.{1,8}/g);
      for (var x = 0; x < arr.length; x++) {
        result += String.fromCharCode(parseInt(arr[x], 2).toString(10));
      }
      responseTxt += result;
    }
    return responseTxt;
  }

  function splitUp(array, howMany) {
    var partLength = Math.floor(array.length / howMany)
    var response = []
    for (var i = 0; i < array.length; i += partLength) {
      response.push(array.slice(i, i + partLength));
    }
    return response;
  }

  return {
    hash: hash
  }
})();


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Sha256;
} else {
  window.Validator = Sha256;
}
