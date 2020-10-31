var Module = typeof pyodide._module !== "undefined" ? pyodide._module : {};
Module.checkABI(1);
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
    Module.finishedDataFileDownloads = 0
}
Module.expectedDataFileDownloads++;
(function() {
    var loadPackage = function(metadata) {
        var PACKAGE_PATH;
        if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/")
        } else if (typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/")
        } else {
            throw "using preloaded data can only be done on a web page or in a web worker"
        }
        var PACKAGE_NAME = "distlib.data";
        var REMOTE_PACKAGE_BASE = "distlib.data";
        if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
        var PACKAGE_UUID = metadata.package_uuid;
        function fetchRemotePackage(packageName, packageSize, callback, errback) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total)
                    size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads)
                            Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size
                        }
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++
                    }
                    total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                    if (Module["setStatus"])
                        Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")")
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"])
                        Module["setStatus"]("Downloading data...")
                }
            }
            ;
            xhr.onerror = function(event) {
                throw new Error("NetworkError for: " + packageName)
            }
            ;
            xhr.onload = function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                    var packageData = xhr.response;
                    callback(packageData)
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL)
                }
            }
            ;
            xhr.send(null)
        }
        function handleError(error) {
            console.error("package error:", error)
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
        if (!fetched)
            fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
                if (fetchedCallback) {
                    fetchedCallback(data);
                    fetchedCallback = null
                } else {
                    fetched = data
                }
            }, handleError);
        function runWithFS() {
            function assert(check, msg) {
                if (!check)
                    throw msg + (new Error).stack
            }
            Module["FS_createPath"]("/", "lib", true, true);
            Module["FS_createPath"]("/lib", "python3.7", true, true);
            Module["FS_createPath"]("/lib/python3.7", "site-packages", true, true);
            Module["FS_createPath"]("/lib/python3.7/site-packages", "distlib", true, true);
            Module["FS_createPath"]("/lib/python3.7/site-packages/distlib", "_backport", true, true);
            function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio
            }
            DataRequest.prototype = {
                requests: {},
                open: function(mode, name) {
                    this.name = name;
                    this.requests[name] = this;
                    Module["addRunDependency"]("fp " + this.name)
                },
                send: function() {},
                onload: function() {
                    var byteArray = this.byteArray.subarray(this.start, this.end);
                    this.finish(byteArray)
                },
                finish: function(byteArray) {
                    var that = this;
                    Module["FS_createPreloadedFile"](this.name, null, byteArray, true, true, function() {
                        Module["removeRunDependency"]("fp " + that.name)
                    }, function() {
                        if (that.audio) {
                            Module["removeRunDependency"]("fp " + that.name)
                        } else {
                            err("Preloading file " + that.name + " failed")
                        }
                    }, false, true);
                    this.requests[this.name] = null
                }
            };
            function processPackageData(arrayBuffer) {
                Module.finishedDataFileDownloads++;
                assert(arrayBuffer, "Loading data file failed.");
                assert(arrayBuffer instanceof ArrayBuffer, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                var curr;
                var compressedData = {
                    data: null,
                    cachedOffset: 587915,
                    cachedIndexes: [-1, -1],
                    cachedChunks: [null, null],
                    offsets: [0, 1284, 2658, 3943, 5065, 6262, 7362, 8454, 9652, 10809, 12091, 13239, 14306, 15359, 16529, 17880, 18890, 20061, 21283, 22518, 23587, 24808, 25960, 27199, 28451, 29837, 30866, 31803, 32991, 34155, 35267, 36410, 37599, 38800, 39960, 41333, 43094, 44934, 46720, 48583, 50456, 52098, 53899, 55628, 57421, 59155, 60990, 62845, 64438, 66208, 67891, 69759, 71627, 73377, 75002, 76625, 78445, 80008, 81633, 83363, 85252, 86889, 88382, 89424, 90181, 91540, 92663, 93692, 94253, 94991, 96649, 98315, 99694, 101009, 102429, 103844, 104751, 106195, 107575, 108915, 110806, 111411, 112710, 113595, 114532, 115448, 116555, 117818, 118957, 120274, 121391, 122538, 123517, 124715, 125807, 127164, 128457, 129853, 130928, 132011, 133155, 134294, 135415, 136499, 137652, 138784, 140012, 141084, 142324, 143404, 144623, 145988, 147142, 148195, 149256, 150333, 151682, 152523, 153736, 154671, 155779, 157054, 158213, 159305, 160416, 161504, 162615, 163476, 164775, 165853, 166719, 167682, 168743, 169741, 170826, 171856, 173209, 174507, 175796, 176985, 178270, 179381, 180576, 181725, 182804, 183999, 185003, 186299, 187348, 188382, 189474, 190587, 191726, 192437, 193495, 194367, 195744, 197119, 198458, 199568, 200801, 201679, 202802, 203918, 205092, 206279, 207495, 208945, 210209, 211473, 212601, 213822, 214970, 216002, 217284, 218369, 219446, 220469, 221638, 222808, 223940, 224941, 226265, 228029, 229868, 231665, 233534, 235371, 237175, 238997, 240721, 242563, 244387, 246156, 247852, 249687, 251472, 253275, 255029, 256630, 258333, 260068, 261700, 263537, 265381, 267046, 268238, 269597, 270206, 271517, 272830, 273641, 274285, 275164, 276910, 278601, 279860, 281228, 282632, 283902, 284799, 286301, 287554, 288959, 291010, 291319, 292605, 293821, 294761, 295785, 296927, 298129, 299262, 300644, 301856, 302818, 303715, 304619, 305512, 306618, 307618, 308708, 309954, 311070, 312193, 313404, 314537, 315702, 316927, 318221, 319308, 319972, 321131, 322504, 323701, 324891, 326102, 327597, 328798, 329913, 330793, 331759, 332954, 333911, 335422, 336657, 337864, 339124, 340257, 341494, 342644, 343499, 344806, 345881, 347075, 348446, 350223, 352031, 353927, 355734, 357587, 359431, 361207, 363087, 364750, 366495, 368211, 370095, 371884, 373728, 375584, 377429, 379196, 380999, 382842, 384681, 386375, 387929, 389742, 391532, 393360, 395192, 396980, 398880, 400122, 401484, 402501, 403273, 404539, 406028, 407433, 408780, 409177, 409854, 411191, 412644, 414300, 415963, 417348, 418660, 420082, 421494, 422398, 423832, 425211, 426555, 427668, 428732, 429896, 431318, 433125, 434896, 436774, 438577, 440444, 442249, 444021, 445788, 447573, 449447, 451256, 453058, 454907, 456698, 458425, 460173, 462004, 463700, 465288, 466918, 468747, 470532, 472350, 474173, 476003, 477374, 478507, 479761, 480302, 481711, 483246, 484683, 485926, 486374, 487075, 488595, 489906, 491633, 493288, 494594, 495911, 497324, 498686, 499552, 501048, 502329, 503649, 504775, 506274, 507285, 508391, 509792, 510903, 512058, 513034, 514222, 515258, 516367, 517477, 518545, 519560, 520710, 521798, 522752, 523909, 524982, 526217, 527408, 528627, 529757, 531065, 532152, 533152, 534092, 535455, 536467, 537640, 538569, 539417, 540661, 541869, 542834, 543989, 545078, 546253, 547311, 548505, 549529, 550503, 551450, 552407, 553625, 554939, 555451, 556645, 557864, 559037, 560370, 561373, 562555, 563862, 565134, 566362, 567393, 568735, 570108, 571138, 572566, 573802, 574955, 576306, 577527, 578862, 580079, 581338, 582547, 583817, 585092, 586387, 587587],
                    sizes: [1284, 1374, 1285, 1122, 1197, 1100, 1092, 1198, 1157, 1282, 1148, 1067, 1053, 1170, 1351, 1010, 1171, 1222, 1235, 1069, 1221, 1152, 1239, 1252, 1386, 1029, 937, 1188, 1164, 1112, 1143, 1189, 1201, 1160, 1373, 1761, 1840, 1786, 1863, 1873, 1642, 1801, 1729, 1793, 1734, 1835, 1855, 1593, 1770, 1683, 1868, 1868, 1750, 1625, 1623, 1820, 1563, 1625, 1730, 1889, 1637, 1493, 1042, 757, 1359, 1123, 1029, 561, 738, 1658, 1666, 1379, 1315, 1420, 1415, 907, 1444, 1380, 1340, 1891, 605, 1299, 885, 937, 916, 1107, 1263, 1139, 1317, 1117, 1147, 979, 1198, 1092, 1357, 1293, 1396, 1075, 1083, 1144, 1139, 1121, 1084, 1153, 1132, 1228, 1072, 1240, 1080, 1219, 1365, 1154, 1053, 1061, 1077, 1349, 841, 1213, 935, 1108, 1275, 1159, 1092, 1111, 1088, 1111, 861, 1299, 1078, 866, 963, 1061, 998, 1085, 1030, 1353, 1298, 1289, 1189, 1285, 1111, 1195, 1149, 1079, 1195, 1004, 1296, 1049, 1034, 1092, 1113, 1139, 711, 1058, 872, 1377, 1375, 1339, 1110, 1233, 878, 1123, 1116, 1174, 1187, 1216, 1450, 1264, 1264, 1128, 1221, 1148, 1032, 1282, 1085, 1077, 1023, 1169, 1170, 1132, 1001, 1324, 1764, 1839, 1797, 1869, 1837, 1804, 1822, 1724, 1842, 1824, 1769, 1696, 1835, 1785, 1803, 1754, 1601, 1703, 1735, 1632, 1837, 1844, 1665, 1192, 1359, 609, 1311, 1313, 811, 644, 879, 1746, 1691, 1259, 1368, 1404, 1270, 897, 1502, 1253, 1405, 2051, 309, 1286, 1216, 940, 1024, 1142, 1202, 1133, 1382, 1212, 962, 897, 904, 893, 1106, 1e3, 1090, 1246, 1116, 1123, 1211, 1133, 1165, 1225, 1294, 1087, 664, 1159, 1373, 1197, 1190, 1211, 1495, 1201, 1115, 880, 966, 1195, 957, 1511, 1235, 1207, 1260, 1133, 1237, 1150, 855, 1307, 1075, 1194, 1371, 1777, 1808, 1896, 1807, 1853, 1844, 1776, 1880, 1663, 1745, 1716, 1884, 1789, 1844, 1856, 1845, 1767, 1803, 1843, 1839, 1694, 1554, 1813, 1790, 1828, 1832, 1788, 1900, 1242, 1362, 1017, 772, 1266, 1489, 1405, 1347, 397, 677, 1337, 1453, 1656, 1663, 1385, 1312, 1422, 1412, 904, 1434, 1379, 1344, 1113, 1064, 1164, 1422, 1807, 1771, 1878, 1803, 1867, 1805, 1772, 1767, 1785, 1874, 1809, 1802, 1849, 1791, 1727, 1748, 1831, 1696, 1588, 1630, 1829, 1785, 1818, 1823, 1830, 1371, 1133, 1254, 541, 1409, 1535, 1437, 1243, 448, 701, 1520, 1311, 1727, 1655, 1306, 1317, 1413, 1362, 866, 1496, 1281, 1320, 1126, 1499, 1011, 1106, 1401, 1111, 1155, 976, 1188, 1036, 1109, 1110, 1068, 1015, 1150, 1088, 954, 1157, 1073, 1235, 1191, 1219, 1130, 1308, 1087, 1e3, 940, 1363, 1012, 1173, 929, 848, 1244, 1208, 965, 1155, 1089, 1175, 1058, 1194, 1024, 974, 947, 957, 1218, 1314, 512, 1194, 1219, 1173, 1333, 1003, 1182, 1307, 1272, 1228, 1031, 1342, 1373, 1030, 1428, 1236, 1153, 1351, 1221, 1335, 1217, 1259, 1209, 1270, 1275, 1295, 1200, 328],
                    successes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
                };
                compressedData.data = byteArray;
                assert(typeof Module.LZ4 === "object", "LZ4 not present - was your app build with  -s LZ4=1  ?");
                Module.LZ4.loadPackage({
                    metadata: metadata,
                    compressedData: compressedData
                });
                Module["removeRunDependency"]("datafile_distlib.data")
            }
            Module["addRunDependency"]("datafile_distlib.data");
            if (!Module.preloadResults)
                Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
                fromCache: false
            };
            if (fetched) {
                processPackageData(fetched);
                fetched = null
            } else {
                fetchedCallback = processPackageData
            }
        }
        if (Module["calledRun"]) {
            runWithFS()
        } else {
            if (!Module["preRun"])
                Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
        }
    };
    loadPackage({
        files: [{
            filename: "/lib/python3.7/site-packages/distlib-0.3.0-py3.7.egg-info",
            start: 0,
            end: 1261,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/scripts.py",
            start: 1261,
            end: 18259,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/database.py",
            start: 18259,
            end: 69304,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/t32.exe",
            start: 69304,
            end: 166072,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/util.py",
            start: 166072,
            end: 225917,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/resources.py",
            start: 225917,
            end: 236683,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/metadata.py",
            start: 236683,
            end: 276917,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/compat.py",
            start: 276917,
            end: 318321,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/locators.py",
            start: 318321,
            end: 370421,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/w32.exe",
            start: 370421,
            end: 460533,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/wheel.py",
            start: 460533,
            end: 500985,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/__init__.py",
            start: 500985,
            end: 501566,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/version.py",
            start: 501566,
            end: 524957,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/manifest.py",
            start: 524957,
            end: 539768,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/index.py",
            start: 539768,
            end: 560834,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/t64.exe",
            start: 560834,
            end: 666818,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/markers.py",
            start: 666818,
            end: 671205,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/w64.exe",
            start: 671205,
            end: 771045,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/tarfile.py",
            start: 771045,
            end: 863673,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/sysconfig.cfg",
            start: 863673,
            end: 866290,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/misc.py",
            start: 866290,
            end: 867261,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/sysconfig.py",
            start: 867261,
            end: 894115,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/__init__.py",
            start: 894115,
            end: 894389,
            audio: 0
        }, {
            filename: "/lib/python3.7/site-packages/distlib/_backport/shutil.py",
            start: 894389,
            end: 920036,
            audio: 0
        }],
        remote_package_size: 592011,
        package_uuid: "d1a0f195-cdad-48bc-8c58-4bbea207c83c"
    })
}
)();

