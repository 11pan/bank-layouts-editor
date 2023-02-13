export const compressLayoutStr = (str) => {
  var banktagstr = str;

  // Parse the tag string
  var layoutName = "";
  var tagName = "";
  var tags = [];
  var layout = [];
  var layoutIndices = [];

  if (str.includes("banktaglayoutsplugin")) {
    var bankLayoutItems = str.substring(
      str.indexOf("banktaglayoutsplugin:") + 1,
      str.indexOf(",banktag")
    );
    bankLayoutItems = bankLayoutItems.split(",");
    layoutName = bankLayoutItems[0].split(":")[1];

    for (var i = 1; i < bankLayoutItems.length; i++) {
      var item = bankLayoutItems[i].split(":");
      layout.push(parseInt(item[0]));
      layoutIndices.push(parseInt(item[1]));
    }

    banktagstr = str.substring(str.indexOf("banktag:") + "banktag:".length);
  }

  var tagItems = banktagstr.split(",");
  tagName = tagItems[0];

  for (var i = 1; i < tagItems.length; i++) {
    tags.push(parseInt(tagItems[i]));
  }

  const tobitstr = (x, len) => {
    var out = "";
    for (var i = 0; i < len; i++) out = (x & (2 ** i) ? "1" : "0") + out;
    return out;
  };
  const gethighbyte = (x) => {
    return ~~(x / 2 ** 8);
  };

  // Now actually do the compression
  var out = "";

  // Find the high bytes
  var highBytes = new Set();
  var alltags = tags.concat(layout);
  for (var i = 0; i < alltags.length; i++)
    highBytes.add(gethighbyte(alltags[i]));
  highBytes = [255].concat(Array.from(highBytes));
  var highByteLen = ~~Math.ceil(Math.log2(highBytes.length));
  out += tobitstr(highBytes.length, 8);

  // Put them all at the start
  var hbMap = {};
  for (var i = 0; i < highBytes.length; i++) hbMap[highBytes[i]] = i;
  for (var i = 1; i < highBytes.length; i++) out += tobitstr(highBytes[i], 8);

  const insertTag = (tag) => {
    var hb = gethighbyte(tag);
    var lb = tag % 2 ** 8;

    var tmp = tobitstr(hbMap[hb], highByteLen) + tobitstr(lb, 8);
    out += tobitstr(hbMap[hb], highByteLen);
    out += tobitstr(lb, 8);
  };

  // Insert the layout
  var tagsLeft = new Set(tags.slice(1));
  var layoutSep = "0".repeat(highByteLen);
  var curIdx = 0;

  for (var i = 0; i < layout.length; i++) {
    var tag = layout[i];
    var idx = layoutIndices[i];

    tagsLeft.delete(tag);

    insertTag(tag);
    if (idx != curIdx) {
      out += layoutSep;
      out += tobitstr(idx - curIdx, 8);
      curIdx = idx;
    }
    curIdx++;
  }

  // Add remaining tags
  var tagSep = layoutSep.concat("0".repeat(8));
  out += tagSep;
  insertTag(tags[0]);
  tagsLeft = Array.from(tagsLeft);
  for (var i = 0; i < tagsLeft.length; i++) insertTag(tagsLeft[i]);
  out += tagSep;

  // Add names
  var nameSep = "0".repeat(8);

  const insertName = (name) => {
    for (var i = 0; i < name.length; i++)
      out += tobitstr(name.charCodeAt(i), 8);
  };

  insertName(layoutName);
  out += nameSep;
  insertName(tagName);

  // Pad output to byte len
  if (out.length % 8 > 0) out += "0".repeat(8 - (out.length % 8));

  // Create byte array
  var outArray = [];
  for (var i = 0; i < out.length; i += 8)
    outArray.push(parseInt(out.substring(i, i + 8), 2));

  out = btoa(String.fromCharCode(...outArray))
    .replace(/\//g, "_")
    .replace(/\+/g, "~");

  return out;
};

export const decompressLayoutStr = (str) => {
  const tobitstr = (x, len) => {
    var out = "";
    for (var i = 0; i < len; i++) out = (x & (2 ** i) ? "1" : "0") + out;
    return out;
  };

  // Decode buffer
  var buffer = "";
  str = atob(str.replace(/_/g, "/").replace(/~/g, "+"));
  for (var i = 0; i < str.length; i++) buffer += tobitstr(str.charCodeAt(i), 8);

  const consume = (bits) => {
    if (buffer.length < bits) throw new Error("Buffer ran out!");

    let out = parseInt(buffer.substring(0, bits), 2);
    buffer = buffer.substring(bits);
    return out;
  };

  // Populate high bytes
  var numHighBytes = consume(8);
  var highByteLen = ~~Math.ceil(Math.log2(numHighBytes));
  var highBytes = [255];
  for (var i = 1; i < numHighBytes; i++) highBytes.push(consume(8));

  const consumeTag = () => {
    let hbIdx = consume(highByteLen);
    let lb = consume(8);

    if (hbIdx == 0) {
      if (lb == 0) return null;
      return -lb;
    } else {
      return highBytes[hbIdx] * 2 ** 8 + lb;
    }
  };

  // Get layout
  var layout = [];
  var layoutIndices = [];
  var curTag = null;
  var curIdx = 0;

  while ((curTag = consumeTag()) !== null) {
    if (curTag >= 0) {
      layout.push(curTag);
      layoutIndices.push(curIdx++);
    } else {
      curIdx -= curTag;
      layoutIndices[layoutIndices.length - 1] = curIdx - 1;
    }
  }

  // Get the tags
  var tags = [];
  while ((curTag = consumeTag()) !== null) tags.push(curTag);
  tags.splice(1, 0, ...Array.from(new Set(layout)));

  // Get the names
  var layoutName = "";
  var curChar = "";
  while ((curChar = String.fromCharCode(consume(8))) != "\0")
    layoutName += curChar;

  var tagName = "";
  while (buffer.length >= 8) tagName += String.fromCharCode(consume(8));

  // Construct layout string
  var layoutStr = "";
  var tagStr = "";

  if (layout.length > 0) {
    layoutStr += "banktaglayoutsplugin:" + layoutName + ",";
    for (var i = 0; i < layout.length; i++)
      layoutStr += layout[i] + ":" + layoutIndices[i] + ",";
    layoutStr += "banktag:";
  }

  tagStr = tagName + "," + tags.join(",");

  return layoutStr + tagStr;
};

// Unit testing

const test = (x) => {
  var c = compressLayoutStr(x);
  var d = decompressLayoutStr(c);

  if (x === d) {
    console.log(c);
    console.log("Test Passed!");
  } else {
    console.log(c);
    console.log("Test Failed!!!!");
    console.log(x);
    console.log(d);
  }
};

/*test(
  "banktaglayoutsplugin:potion,2428:0,121:1,123:2,125:3,113:4,115:5,117:6,119:7,9739:8,9741:9,9743:10,9745:11,3008:12,3010:13,3012:14,3014:15,2430:16,127:17,129:18,131:19,2446:20,175:21,177:22,179:23,2436:24,145:25,147:26,149:27,2440:28,157:29,159:30,161:31,2442:32,163:33,165:34,167:35,12695:36,12697:37,12699:38,12701:39,2444:40,169:41,171:42,173:43,2434:44,139:45,141:46,143:47,6685:48,6687:49,6689:50,6691:51,3024:52,3026:53,3028:54,3030:55,12625:56,12627:57,12629:58,12631:59,5952:60,5954:61,5956:62,5958:63,12913:64,12915:65,12917:66,12919:67,22209:68,22212:69,22215:70,22218:71,23685:72,23688:73,23691:74,23694:75,23733:76,23736:77,23739:78,23742:79,2452:88,2454:89,2456:90,2458:91,banktag:potion,2436,2428,121,123,125,113,115,117,119,9739,9741,9743,9745,3008,3010,3012,3014,2430,127,129,131,2446,175,177,179,2436,145,147,149,2440,157,159,161,2442,163,165,167,12695,12697,12699,12701,2444,169,171,173,2434,139,141,143,6685,6687,6689,6691,3024,3026,3028,3030,12625,12627,12629,12631,5952,5954,5956,5958,12913,12915,12917,12919,22209,22212,22215,22218,23685,23688,23691,23694,23733,23736,23739,23742,2452,2454,2456,2458"
);

test(
  "banktaglayoutsplugin:teleports,11850:0,11852:1,11854:2,563:3,556:4,557:5,555:6,554:7,11856:8,11858:9,11860:10,13126:11,22943:12,11140:13,13134:14,6707:15,13121:16,22401:17,21760:18,13113:19,13130:20,13139:21,13110:22,13143:23,772:24,4251:25,13660:26,19564:27,22114:28,25818:29,13120:30,8013:31,9799:32,9781:33,9790:34,13280:35,23946:38,14440:39,3853:40,3855:41,2552:42,2554:43,11866:44,11867:45,11194:46,11193:47,21129:48,21132:49,21146:50,21149:51,21166:52,21169:53,13392:54,13393:55,11972:56,11118:57,11120:58,11126:59,11978:60,1712:61,1710:62,1704:63,11980:64,11982:65,2572:66,13102:67,6099:68,6100:69,6101:70,6102:71,3867:88,2566:89,11873:90,11190:91,21138:92,21155:93,21175:94,2570:95,23904:96,banktag:teleports,11850,11850,11852,11854,563,556,557,555,554,11856,11858,11860,13126,22943,11140,13134,6707,13121,22401,21760,13113,13130,13139,13110,13143,772,4251,13660,19564,22114,25818,13120,8013,9799,9781,9790,13280,23946,14440,3853,3855,2552,2554,11866,11867,11194,11193,21129,21132,21146,21149,21166,21169,13392,13393,11972,11118,11120,11126,11978,1712,1710,1704,11980,11982,2572,13102,6099,6100,6101,6102,3867,2566,11873,11190,21138,21155,21175,2570,23904,22400,2556,2558,3865,3863,3861,3859,3857,2564,2562,2560,13135,13132,13124,13122,13123,13111,13103,22947,995,770,11192,11191,5093,13114,13115,13129,10510,13131,6450,13137,13138,13140,22941,22945,13125,13127,13128,11138,11136,13136,3981,13108,13109,762,13117,13118,13119,3983,13141,13142,13144,21171,21173,11868,11869,11870,11871,11872,21134,21136,11122,11124,11974,21151,21153,11984,11986,11988,1706,1708,11976,20586"
);

test(
  "seed,299,4486,5096,5097,5098,5099,5100,5101,5102,5103,5104,5105,5106,5280,5281,5282,5283,5284,5285,5286,5287,5288,5289,5290,5291,5292,5293,5294,5295,5296,5297,5298,5299,5300,5301,5302,5303,5304,5305,5306,5307,5308,5309,5310,5311,5312,5313,5314,5315,5316,5317,5318,5319,5320,5321,5322,5323,5324,6112,6311,6453,6454,6455,6456,6457,6458,6459,6460,6710,13657,20903,20906,20909,21486,21488,21490,22869,22871,22873,22875,22877,22879,22881,22883,22885,22887,2366"
);

test(
  "banktaglayoutsplugin:skilling,1623:0,1621:1,1619:2,1617:3,1631:4,6571:5,19496:6,1755:7,1607:8,1605:9,1603:10,1601:11,1615:12,6573:13,19493:14,1592:15,1625:16,1627:17,1629:18,442:20,444:21,11065:23,1609:24,1611:25,1613:26,2355:28,2357:29,1597:31,436:32,438:33,440:34,453:35,447:36,449:37,451:38,1595:39,2347:40,2349:41,2351:42,2353:43,2359:44,2361:45,2363:46,5523:47,1391:48,573:49,571:50,575:51,569:52,567:53,1733:54,1734:55,1511:56,1521:57,6333:58,6332:59,1753:60,1751:61,1749:62,1747:63,960:64,8778:65,8780:66,8782:67,1745:68,2505:69,2507:70,2509:71,401:78,1783:79,banktag:skilling,1607,1623,1621,1619,1617,1631,6571,19496,1755,1607,1605,1603,1601,1615,6573,19493,1592,1625,1627,1629,442,444,11065,1609,1611,1613,2355,2357,1597,436,438,440,453,447,449,451,1595,2347,2349,2351,2353,2359,2361,2363,5523,1391,573,571,575,569,567,1733,1734,1511,1521,6333,6332,1753,1751,1749,1747,960,8778,8780,8782,1745,2505,2507,2509,401,1783"
);

test(
  "banktaglayoutsplugin:farming,18208:0,18210:1,18213:2,563:3,554:4,13702:5,556:6,555:7,18209:8,18211:9,18212:10,17728:11,952:12,13880:13,13881:14,5325:15,18659:16,772:17,17772:18,995:19,5331:20,5336:21,5340:22,21622:23,5354:24,6032:25,6034:26,21483:27,22994:28,22997:29,6036:30,2114:31,5291:40,5292:41,5293:42,5294:43,5295:44,5296:45,5297:46,5298:47,5299:48,5300:49,5301:50,5302:51,5303:52,5304:53,5100:55,15196:56,15197:57,203:58,205:59,15200:60,3049:61,15201:62,211:63,213:64,3051:65,215:66,2485:67,217:68,219:69,15215:72,251:73,253:74,15218:75,257:76,2998:77,259:78,261:79,263:80,3000:81,265:82,2481:83,267:84,269:85,5312:88,5313:89,5314:90,5315:91,5316:92,22871:93,21486:94,21488:95,5370:96,5371:97,5372:98,5373:99,5374:100,22859:101,21477:102,21480:103,5283:104,5284:105,5285:106,5286:107,5287:108,5288:109,5289:110,22877:111,5496:112,5497:113,5498:114,5499:115,5500:116,5501:117,5502:118,22866:119,21490:120,5321:121,22879:122,5290:124,22869:125,22875:126,5317:127,banktag:farming,7409,18208,18210,18213,563,554,13702,556,555,18209,18211,18212,17728,952,13880,13881,5325,18659,772,17772,995,5331,5336,5340,21622,5354,6032,6034,21483,22994,22997,6036,2114,5291,5292,5293,5294,5295,5296,5297,5298,5299,5300,5301,5302,5303,5304,5100,15196,15197,203,205,15200,3049,15201,211,213,3051,215,2485,217,219,15215,251,253,15218,257,2998,259,261,263,3000,265,2481,267,269,5312,5313,5314,5315,5316,22871,21486,21488,5370,5371,5372,5373,5374,22859,21477,21480,5283,5284,5285,5286,5287,5288,5289,22877,5496,5497,5498,5499,5500,5501,5502,22866,21490,5321,22879,5290,22869,22875,5317,11860,11858,11856,11854,11852,11850,255,249,5343,5341,4251,5338,209,207,201,199,7409,13121,557"
);

test(
  "banktaglayoutsplugin:food,317:0,321:1,335:2,331:3,359:4,363:5,377:6,371:7,315:8,319:9,333:10,329:11,361:12,365:13,379:14,373:15,7944:24,3142:25,383:26,389:27,13439:28,11934:29,6685:30,6687:31,7946:32,3144:33,385:34,391:35,13441:36,11936:37,6689:38,6691:39,19662:48,7198:49,21690:50,22795:51,7218:52,1987:54,1937:55,19659:56,7200:57,21687:58,22792:59,7220:60,1935:62,1993:63,3150:72,10476:73,1891:75,1893:76,1895:77,7054:79,1897:83,1899:84,1901:85,2003:87,2309:95,banktag:food,385,317,321,335,331,359,363,377,371,315,319,333,329,361,365,379,373,7944,3142,383,389,13439,11934,6685,6687,7946,3144,385,391,13441,11936,6689,6691,19662,7198,21690,22795,7218,1987,1937,19659,7200,21687,22792,7220,1935,1993,3150,10476,1891,1893,1895,7054,1897,1899,1901,2003,2309"
);

// This will fail (but it's okay)
// The layout for this one contains tags which aren't in the tags list, which is malformed.
// The decompressor will (erroneously) add those layout items into the tags list, which is what we want anyway.
test(
  "banktaglayoutsplugin:birdhouse,11194:0,11191:1,16285:3,13884:4,11190:7,13978:16,1521:17,1519:18,6333:19,1517:20,6332:21,1515:22,1513:23,5305:32,5308:33,5307:34,5309:35,13804:36,13880:38,7534:39,13881:46,7535:47,952:54,18811:55,21490:62,21504:63,banktag:birdhouse,22204,22198,11260,11259,1755,9813,11194,11193,11192,11191,11190,952,21504,7535,7534,5343,5341,5309,5308,5307,5306,5305,21490,1521,1519,1517,1515,1513,1511,6333,6332,2347,6666"
);*/
