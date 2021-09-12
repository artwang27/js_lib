/*
把 doc 文字檔轉化成一個 JSON 物件

【註解】
doc檔 與  text檔: 
    普通的文字檔我稱它為 text 檔， 
    doc 檔有特定的格式，是處理過的 text 檔，專門用來記錄資料，他的第一列是欄位名稱，接下來的各列是資料的內容

A:先把 doc 文字檔前置處理，此檔的第 0 列必須包含標頭，也就是[欄位名稱]
B:接下來的資料以空白區分，有多的空白列也沒有關係，讀取文字檔時會自動忽略
C:轉換成 1 個 JSON 物件，我把它稱之 table 物件

1.此(table)物件先把 doc 的[欄位名稱]集合起來，形成 fields 陣列
2.此(table)物件把 doc 的[資料]集合起來，形成 records 陣列
3.轉換成的 json 物件，必定包含 fields[]、records[]

因此 JSON 物件將會形如：
table={
    "fields": ["num", "name", "sex"], 
    "records": [
        {"num": "1", "name":"陳柏宇", "sex":"1"}, 
        {"num":"19", "name":"陳姷安", "sex":"0"},
        {"num":"22", "name":"陳安箴", "sex":"0"}
    ]
}

*/


//把doc文字檔轉化成 JSON 物件
//doc 是文字檔，在讀檔時已經被處理過空白列了
function docToJSON(doc) {
    // 文字檔將會被轉換成 table 物件
    let table = {
        fields: [],
        records: []
    }

    doc = removeBlankLines(doc);    //去掉所有空白列
    let lines = docAsLines(doc); //分解成一行一行的陣列
    table.fields = lineAsArray(lines[0]); //讀出標題列

    //排除標題列，繼續處理
    //lines.slice(1) : 排除標題的第 0 列，從第1列開始，構成 lines 陣列的副本
    lines.slice(1).forEach(line => {
        let itemAry = lineAsArray(line);  //分解成  itemAry

        //做成 record 物件
        let rcd = {};
        itemAry.forEach((fieldData, index) => {
            let fieldName = table.fields[index];  //欄位名稱
            rcd[fieldName] = fieldData;  //欄位內容
        });

        //存入 table
        table.records.push(rcd);
    });


    return table;
}


//把 doc 直接轉譯成 json 化過的長字串，為了要方便顯示在 textArea，或黏貼資料，準備存檔
function docToJsonAsLongString(doc) {
    //轉譯過的 JSON 物件顯示出來
    let object_JSON = docToJSON(doc);    //獲取 JSON 物件
    return JSON.stringify(object_JSON);  //字串化
}