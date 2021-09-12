
//當讀完文字檔內容時
//1. 會去除不必要的空白行，
//2. 並存放在 TextFileReader.doc 內
class TextFileReader {

    //參數：inputFileDomId: 
    //是指<input type="file"  id ="inputFileDomId" > 裡的 id 字串，
    //此處為 "inputFileDomId"，
    //它將被轉為 jquery 物件， 若多了'#' ，傳入 "#inputFileDomId" 也是 OK 的
    constructor(inputFileDomId) {
        if (inputFileDomId[0] != "#") { inputFileDomId = "#" + inputFileDomId; }  //若少了 "#" 開頭，那就幫他加上
        this.$myfileDom = $(inputFileDomId);  //select id 必須是以 '#' 開頭
        this.fReader = new FileReader();
        this.doc = "";    //當讀完文字檔內容，會去除不必要的空白行，並存放在 doc 內

    }

    //callback: 讀檔完後的回呼函式
    //caller:   回呼函式所屬的物件(傳入該物件的 this 指標即可)
    onload(callback, caller) {
        let self = this;

        //bind 語法: $(selector).bind(event, data, function (E))
        this.$myfileDom.on("change", { fReaderOKFunction: callback }, function (E) {
            //print2(this);      //這裡的 this 是  <input id="myfile" type="file"> dom 物件，不是 jQuery 喔！
            let file = this.files[0];   //只處理第一個檔

            self.fReader.readAsText(file);

            self.fReader.onload = function (event) {
                self.doc = event.target.result;  //讀完的文字檔可能包含了不必要的空白列
                self.doc = self.removeBlankLines(self.doc);   //清除所有空白列
                //到此，文字內容已經存入 TextFileReader.doc 內了

                //print2(E);  //E 是 Event 物件
                E.data.fReaderOKFunction(caller);  //當檔案讀取完畢，呼叫預設的 callback()
                //也就是執行 callBack( caller ); 

            }//fReader
        })//bind
    }//constructor


    //去掉所有空白列
    removeBlankLines(doc) {
        return doc.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '')
    }


}//class


/* 使用範例：
class Game {
    //讀取上次的分配結果
    loadTable() {
        //如果選擇檔案的 input file dom ，他的 id 是 #myJsonFile 的話
        this.textFileReader = new TextFileReader("#myJsonFile");
        this.textFileReader.onload(this.onload, this);  //注意 this 寫法
    }

    onload(self) {  //this 變成 self 了
        self.readJsonFileOk();  
    }


    //當成功讀入工作分配檔
    readJsonFileOk() {
        let doc = this.textFileReader.doc;  //讀到的檔案內容被存在 textFileReader.doc
        let records = JSON.parse(doc).records;   //取出 records
    }
}
*/



/*
【註解】
doc檔 與  text檔:
普通的文字檔我稱它為 text 檔，
doc 檔有特定的格式，是處理過的 text 檔，專門用來記錄資料，他的第一列是欄位名稱，接下來的各列是資料的內容

程式寫法
註一：
bind 語法: $(selector).bind(event, data, function (e))
其中 e 是 Event 物件，包含了很多屬性，像是
type: "change",
    target: input#myfile,
        data : 額外資料屬性
當有額外資訊要傳入時，可以用 bind 的第二個參數來設定 e.data

註二：
fReader.onload = function (event) 與 change 的 event 為了避免名稱衝突，
所以把 change 的 event 改名為 E
*/
