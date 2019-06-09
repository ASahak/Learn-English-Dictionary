<template>
    <div> 
      
      <div class="langBar d-flex justify-content-between p-2">
        <span class="languages">
          <span :vModel="langObj.lang1" v-text="lang1"> </span>
          <span class="lnr lnr-arrow-right"></span>
          <span :vModel="langObj.lang2" v-text="lang2"> </span>
        </span>
        <i class="fa fa-retweet reverseLang" aria-hidden="true" @click="reverseLang"></i>
      </div>
      <div class="searchBar">
        <label for="findWord" @click="focusSearchWord($event)" ref="labelDownBlur">Find word....</label>
        <input type="search"  @keyup="findWord($event.target.value)" @blur="labelDown($event)" @focus="labelSame($event)" ref="focusFind">
        <span class="lnr lnr-cross crossValue" ref="crossValue" v-show="valueNotString" @click="deleteValue"></span>
        <ul ref="findWords" class="searchResult" type="none" v-show="isSearchWord">
          <li  v-for="(word) in SearchWords" :key="word.value"  :style="isReverseStyle">
            <span ref="injectHtml1" :dataTxt1="word.english"></span>
            <span ref="injectHtml2" :dataTxt2="word.armenian"></span>
            <img v-if="filterBoolean" src="../assets/dotted.png" @click="editBlockParentShow($event, word)" alt="" style="max-width:20px; cursor:pointer; position:absolute; top:2px; right:0">
            <div class="editBlock" ref="threeBlock">
              <span class="lnr lnr-thumbs-up" @click="iLearnedThis($event, word['.key'])" :class="{'like': likeClass}"></span>
              <span class="lnr lnr-pencil" @click="editDataItem($event)"></span>
              <span class="lnr lnr-cross" @click="deleteDataItem(word['.key'], $event, true)"></span>
            </div> 
            <div class="editBlockChange editBlockViaSearch" ref="heightEdit" :style="topEditBlock">
              <label >English</label>
              <input type="text" class="" v-model="word.english">  
              <label >Armenian</label>
              <input type="text" class="" v-model="word.armenian" >  
              <button @click="saveDataItem(word['.key'], word.english, word.armenian, $event, true)">Save</button>
            </div>
          </li>  
        </ul>
      </div>
      <div class="pagination-filter d-flex align-items-center justify-content-between">
        <div class="filterBlock w-50" > 
          <div class="activeFilter" @click="filteSub = !filteSub"><span v-text="activeFilter" class="changesText"></span><i class="fa fa-caret-down" aria-hidden="true"></i></div>
          <ul class="dropDown p-0" type="none" v-show="filteSub">   
            <li @click="bindText($event.target.innerText)">All Words</li>
            <li @click="bindText($event.target.innerText)">Added Date</li>
            <li  @click="bindText($event.target.innerText)">A-Z</li>
            <li  @click="bindText($event.target.innerText)">Z-A</li>
            <li v-if="filterBoolean"  @click="bindText($event.target.innerText)">Learned</li>
            <li v-if="filterBoolean"  @click="bindText($event.target.innerText)">Not Learned</li>
          </ul>
        </div>
        <div class="pagination-slide d-flex align-items-center justify-content-between w-50">
          <div class="paginationWrap">
            {{pageBegan}}/{{pagination}}
          </div>
          <div class="slide">
            <span class="lnr lnr-chevron-left" @click="prev"></span>
            <span class="lnr lnr-chevron-right" @click="next"></span>
          </div>
        </div>
      </div>
      <div  style=" background-color: #eae5e5; padding: 100px 0;"   v-show="!preLoader">
        <img src="../assets/preloader.gif" alt="" style="max-width: 140px; margin: auto;display: block; padding: 30px;">
      </div>
      <ul class="allWords p-0" type="none" ref="bottomNumber" v-show="preLoader">
        <li v-for="word in wordsCollection20" :key="word.value" :style="isReverseStyle">
          <span class="leftItem">{{word.english}}</span><span class="rightItem">{{word.armenian}}</span>
          <img v-if="filterBoolean" src="../assets/dotted.png" @click="editBlockParentShow($event, word)" alt="" style="max-width:20px; cursor:pointer; position:absolute; top:2px; right:0">
          <div class="editBlock" ref="threeBlock">
            <span class="lnr lnr-thumbs-up" @click="iLearnedThis($event, word['.key'])" :class="{'like': likeClass}"></span>
            <span class="lnr lnr-pencil" @click="editDataItem($event)"></span>
            <span class="lnr lnr-cross" @click="deleteDataItem(word['.key'], $event, false)"></span>
          </div> 
          <div class="editBlockChange" ref="heightEdit" :style="topEditBlock">
            <label >English</label>
            <input type="text" class="" v-model="word.english">  
            <label >Armenian</label>
            <input type="text" class="" v-model="word.armenian" >  
            <button @click="saveDataItem(word['.key'], word.english, word.armenian, $event, false)">Save</button>
          </div> 
           
        </li>
      </ul>
    </div>
</template>
<script>
import firebase from 'firebase';
import auth from '../auth'
import db from '../main.js'
export default {
  name: 'home',
  data () {
    return {
      dataWd:[],
      filterBoolean:false,
      filteSub:false,
      activeFilter:'Filter By... ',
      wordsCollection: [],
      wordsCollection20: [],
      idObj :{},
      editBlockParent:false,
      armenianEdit:'',
      englishEdit:'',
      topEditBlock:{},
      pagination:0,
      pageBegan:1,
      langObj:{
        lang1:"english",
        lang2:"armenian",
      },
      SearchWords:[],
      pageCount:20,
      isSearchWord:false,
      preLoader:false,
      lang1:'Eng',
      lang2:'Arm',
      isReverse:false,
      isReverseStyle:{},
      valueNotString:false,
      isLike: false
    }
  },
   firestore() {
      return {
        wordData: db.collection('words').orderBy('publication'),
      }
    },
  mounted() {
    var self = this;
    // db
    //   .collection('words').orderBy('publication')
    //   .get()
    //   .then(snap => {
    //     const wordsCollection = [];
    //     snap.forEach(doc => {
    //       this.idObj = doc.data();
    //       this.idObj.id = doc.id;
    //       wordsCollection.push(this.idObj );
    //       this.dataWd.push(this.idObj );
    //     });
    //     this.wordsCollection = wordsCollection;
    //   });
      this.wordsCollection = this.wordData
      
      var clearInterData = setInterval(()=>{
        if(this.wordsCollection[0] != undefined){
          clearInterval(clearInterData);
          this.pagination =Math.ceil(this.wordsCollection.length/20);
          this.preLoader = true;
          for(let i =0; i < 20; i++){
            if(this.wordsCollection[i]){
              this.wordsCollection20.push(this.wordsCollection[i])
            }
          } 
        }
      }, 1000);
      window.addEventListener('click', this.onClickWindow)
  },
  created(){
    var handle = setInterval(()=>{
      if(auth.isLogined != undefined){
        clearInterval(handle)
        this.filterBoolean =  auth.isLogined
      }
    }, 1000)
  },
  computed: {
    likeClass () {
      return this.isLike
    }
  },
  methods:{
    deleteValue(){
      this.valueNotString = false;
      this.$refs.focusFind.focus()
      this.$refs.focusFind.value = '';
      this.isSearchWord = false;
    },
    reverseLang(){
      this.$refs.focusFind.value = '';
      this.valueNotString = false;
      
      this.$refs.labelDownBlur.style.top = 10+'px'
      this.$refs.labelDownBlur.style.fontSize = 13+'px';
      this.isSearchWord = false;
      this.lang1 = (this.lang1 == "Arm")?"Eng":"Arm";
      this.lang2 = (this.lang2 == "Eng")?"Arm":"Eng";
      this.isReverse  = !this.isReverse;
      if(this.isReverse){
        this.isReverseStyle = Object.assign({
          flexDirection:'row-reverse'
        })
      this.langObj.lang1 = 'armenian'
      }
      else{
      this.langObj.lang1 = 'english'
        this.isReverseStyle = Object.assign({
          flexDirection:'row'
        })
      }
    },
    findWord(event){
      this.valueNotString = true
      var self = this;
      this.isSearchWord = true;
      if(event == ""){
        this.valueNotString = false;
        this.isSearchWord = false;
      }
      var empObj = {};
     
      var items = []
      this.wordsCollection.map((elm)=>{
        empObj = Object.assign({
          '.key':elm['.key'],
          'english':elm.english,
          'armenian':elm.armenian,
          'isLearned':elm.isLearned,
          'publication':elm.publication
        })
        items.push(empObj)
      })
      function search(arr, s){
        var matches = [], i, key;
        for( i = arr.length; i--; )
          if( arr[i][self.langObj.lang1].toLowerCase().indexOf(s.toLowerCase()) > -1 ){
            // arr[i][self.langObj.lang1] = arr[i][self.langObj.lang1].toLowerCase().replace(s.toLowerCase(), '<b>' + s.toLowerCase() + '</b>');
            matches.push(arr[i]);
          }
          return matches;
        };
        var result =""
        if(event != ""){
           result = search(items, event);
        }
        if(result.length ==0 && event != ""){
          this.SearchWords = [];
          this.SearchWords.push({english:"No result",armenian:"No result"});
        }
        else{
          this.SearchWords = result
        }
        setTimeout(()=>{
          if(this.lang1 =="Eng"){
            Array.prototype.map.call(this.$refs.injectHtml1, item=>{
            // let doc = new DOMParser().parseFromString(item.innerText, 'text/html');
              var attr1 = item.getAttribute('dataTxt1');
              item.textContent =attr1
              if(event== "")
                  item.textContent =attr1
              else
                item.innerHTML = attr1.toLowerCase().replace(event.toLowerCase(), "<b>"+ event.toLowerCase() +"</b>")
            })
            Array.prototype.map.call(this.$refs.injectHtml2, item=>{
            // let doc = new DOMParser().parseFromString(item.innerText, 'text/html');
              var attr2 = item.getAttribute('dataTxt2');
              item.textContent =attr2
              if(event== "")
                  item.textContent =attr2
              else
                item.innerHTML = attr2;
            })
          }
          if(this.lang1 =="Arm"){
            Array.prototype.map.call(this.$refs.injectHtml1, item=>{
            // let doc = new DOMParser().parseFromString(item.innerText, 'text/html');
              var attr1 = item.getAttribute('dataTxt1');
              item.textContent =attr1
              if(event== "")
                  item.textContent =attr1
              else
                item.innerHTML = attr1
            })
            Array.prototype.map.call(this.$refs.injectHtml2, item=>{
            // let doc = new DOMParser().parseFromString(item.innerText, 'text/html');
              var attr2 = item.getAttribute('dataTxt2');
              item.textContent =attr2
              if(event== "")
                  item.textContent =attr2
              else
                item.innerHTML = attr2.toLowerCase().replace(event.toLowerCase(), "<b>"+ event.toLowerCase() +"</b>");
            })
          }
          
        }, 10)
        //  arr[i][self.langObj.lang1] =doc.body[0]
        
    },
    onClickWindow(event){
      if(event.target.className != 'changesText'){
          if(this.filteSub){
            this.filteSub = false
          }
      }
    },
    prev(){
      
      if(this.pageBegan>1){
      Array.prototype.map.call(this.$refs.threeBlock, item=>{
        item.style.display = 'none'
      })
      this.pageBegan--;
      this.pageCount-=20;
      this.wordsCollection20 = [] 
      for(let i =this.pageCount-20; i<this.pageCount; i++){
        
        if(this.wordsCollection[i]){
          this.wordsCollection20.push(this.wordsCollection[i])
        }
      } 
     }
    },
   next(){

     if(this.pageBegan<this.pagination){
      Array.prototype.map.call(this.$refs.threeBlock, item=>{
        item.style.display = 'none'
      
      })
     this.pageBegan++;
        this.pageCount+=20;
        this.wordsCollection20 = [] 
        for(let i =this.pageCount-20; i<this.pageCount; i++){
          if(this.wordsCollection[i]){
            this.wordsCollection20.push(this.wordsCollection[i])
          }
        } 
     }
   },
    labelSame(event){
       Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
        event.target.parentElement.children[0].style.top = -8+'px'
        event.target.parentElement.children[0].style.color ='#000'
        event.target.parentElement.children[0].style.fontSize = 10+'px';
      })
    },
    focusSearchWord(event){
        event.target.style.top = -8+'px'
        event.target.style.fontSize = 10+'px';
        event.target.style.color = 10+'#000';
        this.$refs.focusFind.focus()
    },
     labelDown(event){
      if(event.target.value == ''){
        Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
          event.target.parentElement.children[0].style.top = 10+'px'
          event.target.parentElement.children[0].style.fontSize = 13+'px';
          event.target.parentElement.children[0].style.color = '#a7a7a2';
      })
      }
    },
    
    bindText(event){
      this.activeFilter  = event;
        function dynamicSort(property) {
          var sortOrder = 1;
          if(property[0] === "-") {
              sortOrder = -1;
              property = property.substr(1);
          }
          return function (a,b) {
              if(sortOrder == -1){
                  return b[property].toString().localeCompare(a[property].toString());
              }else{
                  return a[property].toString().localeCompare(b[property].toString());
              }        
          }
      }
    

      if(event == 'All Words'){
        this.pageBegan = 1;
        this.pageCount = 20
        this.wordsCollection20 = [];
        this.wordsCollection = this.wordData;
        for(let i =0; i<20; i++){
          this.wordsCollection20.push(this.wordsCollection[i])
        }
        this.pagination = Math.ceil(this.wordsCollection.length/20);
      }
      if(event == 'Not Learned'){ 
        this.pageBegan = 1;
        this.pageCount = 20
        Array.prototype.map.call(this.$refs.threeBlock, item=>{
          item.style.display = 'none'
        })
        this.wordsCollection20 = [];
        const wordsCollection = [];
        this.wordsCollection = this.wordData;
        this.wordsCollection.forEach( (item, ind)=>{
          if(!item.isLearned){
            wordsCollection.push(item)
          }
        })
        this.wordsCollection = wordsCollection
    
         for(let i =0; i<20; i++){
           if(wordsCollection[i]){
             this.wordsCollection20.push(wordsCollection[i])
           }
        }
        this.pagination = Math.ceil(wordsCollection.length/20);
      }
      if(event == 'Learned'){
        this.pageBegan = 1;
        this.pageCount = 20
        Array.prototype.map.call(this.$refs.threeBlock, item=>{
          item.style.display = 'none'
        })
        this.wordsCollection20 = [];
        const wordsCollection = [];
        this.wordsCollection = this.wordData;
        this.wordsCollection.forEach( (item, ind)=>{
          if(item.isLearned){
            wordsCollection.push(item)
          }
        })
        this.wordsCollection = wordsCollection
    
         for(let i =0; i<20; i++){
           if(wordsCollection[i]){
              this.wordsCollection20.push(wordsCollection[i])
           }
        }
        this.pagination = Math.ceil(wordsCollection.length/20);
      }
      if(event == 'Added Date'){
        this.pageBegan = 1;
        this.pageCount = 20
         Array.prototype.map.call(this.$refs.threeBlock, item=>{
          item.style.display = 'none'
        })
        // this.wordsCollection = this.dataWd;
        this.wordsCollection.sort(dynamicSort("publication"));
        this.wordsCollection20 = [];
        for(let i =0; i < 20; i++){
          if(this.wordsCollection[i]){
            this.wordsCollection20.push(this.wordsCollection[i])
          }
        }
      }
      if(event == 'A-Z'){
        this.pageBegan = 1;
        this.pageCount = 20
         Array.prototype.map.call(this.$refs.threeBlock, item=>{
          item.style.display = 'none'
        })
        this.wordsCollection.sort(dynamicSort("english"));
        this.wordsCollection20 = [];
        for(let i =0; i<20; i++){
           if(this.wordsCollection[i]){
              this.wordsCollection20.push(this.wordsCollection[i])
           }
        }
      }
      if(event == 'Z-A'){
        this.pageBegan = 1;
        this.pageCount = 20
         Array.prototype.map.call(this.$refs.threeBlock, item=>{
          item.style.display = 'none'
        })
        this.wordsCollection.sort(dynamicSort("english"));
        this.wordsCollection.reverse()
        this.wordsCollection20 = [];
        for(let i =0; i < 20; i++){
           if(this.wordsCollection[i]){
              this.wordsCollection20.push(this.wordsCollection[i])
           }
        }
      }
    },
    editDataItem(event){
      Array.prototype.map.call(this.$refs.heightEdit, item=>{
        item.style.display="none"
      })
      event.target.offsetParent.nextElementSibling.style.display = (event.target.offsetParent.nextElementSibling.style.display == "block") ? 'none':'block'
      if(event.target.getBoundingClientRect().top + 170 > this.$refs.bottomNumber.getBoundingClientRect().bottom){
      
        this.topEditBlock = Object.assign({
          top:'inherit',
          bottom:24+'px',
          opacity:1
        })
        }
      else{
        this.topEditBlock = Object.assign({
          top:23+'px',
          opacity:1
        })
        
      }
      event.target.offsetParent.style.display="none"
    },
    iLearnedThis(event, id){
      Array.prototype.map.call(this.wordData, item=>{
        if(item['.key'] == id){
          if(!item.isLearned){
            event.target.classList.add("like")
            return db.collection("words").doc(id).update({ isLearned:true})
          }
          else{
            event.target.classList.remove("like")
            return db.collection("words").doc(id).update({ isLearned:false})
          }
        }
      })
    },
    saveDataItem(id, eng, arm, event, reload){
      db.collection("words").doc(id).update({ english:eng, armenian:arm}).then(_ =>{
          setTimeout(()=>{
            if(reload){
              window.location.reload()
            }
            event.target.offsetParent.style.display = "none"
          }, 1000)
      });
    },
    deleteDataItem(id, event, reload){
      var self = this;
      Array.prototype.map.call(this.wordsCollection, (item, ind)=>{
        if(item['.key'] == id){
          this.wordsCollection.splice(this.wordsCollection.indexOf(item), 1)
        }
      }) 
      Array.prototype.map.call(this.wordsCollection20, (item, ind)=>{
        if(item['.key'] == id){
          if(this.wordsCollection.length > this.pageCount-1){
            this.wordsCollection20.push(this.wordsCollection[this.pageCount-1])  
          }
          this.wordsCollection20.splice(this.wordsCollection20.indexOf(item), 1)
        }
      }) 
      if(this.wordsCollection20.length === 0){
        if(this.pageBegan > 0){
          this.pageBegan--
        }
        this.wordsCollection20 = []
        this.pageCount = this.wordsCollection.length 
        for(let i = this.wordsCollection.length- 20 ; i < this.wordsCollection.length; i++){
          if(this.wordsCollection[i]){
            this.wordsCollection20.push(this.wordsCollection[i])
          }
        }
      }
      
      db.collection("words").doc(id).delete().then(function() {
          console.log("Document successfully deleted!");
          self.pagination = Math.ceil(self.wordsCollection.length/20);
          setTimeout(()=>{
            if(reload){
              window.location.reload()
            }
          }, 1000)
          
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      event.target.offsetParent.style.display = (event.target.offsetParent.style.display == "block") ? 'none':'block'
    },
    editBlockParentShow(event, item){
      if(document.querySelector('.activeEdit'))document.querySelector('.activeEdit').classList.remove('activeEdit')
       this.topEditBlock = Object.assign({
        top:'inherit',
        bottom:'inherit',
        opacity:0
      })
      db.collection("words").doc(item['.key']).get().then(res=>{
        this.isLike = res.data().isLearned
        event.target.nextElementSibling.style.display = 'block';
      })
      event.target.classList.add('activeEdit')
      event.target.nextElementSibling.classList.add('selected')
      Array.prototype.map.call(this.$refs.threeBlock, item=>{
        if(item.className.split(" ")[1] != 'selected')
        item.style.display="none"
        item.className="editBlock"
      })
      window.addEventListener('click', (e)=>{
        if(e.target.closest('.activeEdit')){
          return
        }
        if(!e.target.closest('.editBlock')){
          [].slice.call(Array.from(document.querySelectorAll('.editBlock'))).forEach(elem => {
            elem.style.display = 'none'
          })
        }
      })
    }
  }
}
</script>
<style>
  .languages .lnr {
    font-size: 12px;
    top: 1px;
    position: relative;
    margin: 0 5px;
  }
  .languages {
      font-size: 13px;
  }
  .reverseLang{
    cursor: pointer;
  }
  .searchBar{
    position: relative;
    padding: 5px 6px 0
  }
  .searchBar > input:focus{
    outline: none
  }
  .searchBar > input{
        display: block;
    width: 100%;
    border: 1px solid #ccc;
    padding: 2px;
    padding-left: 10px;
    border-radius: 15px;
  }
  .searchBar > label{
    position: absolute;
    font-size: 14px;
    top: 8px;
    left: 20px;
    transition: .4s;
    color: #a7a7a2;
  }
  .editBlockViaSearch{
      top: 0 !important;
      position: fixed !important;
      display: block;
      bottom: 0;
      margin: auto;
      height: 160px;
      width: 90% !important;
      left: 10px !important;
      right: 0;
      z-index: 2222;
      max-width: 280px;
  }
  .searchResult > li:last-child{
    box-shadow: none
  }
  .searchResult > li > img{
    bottom: 0;
    height: 20px;
    margin: auto;
  }
  .searchResult > li:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #000;
    margin: auto;
    top: 0;
  }
  .searchResult > li{
    display: flex;
    font-size: 13px;
    box-shadow: 0px 3px 4px -4px #585353;
    padding: 5px 5px;
    position: relative;
  }
  .searchResult > li > span:last-child{
    padding-left: 5px;
  }
  .searchResult > li > span{
    width: 50%;
    display: block;
    padding-left: 5px;
  }
  .searchResult::-webkit-scrollbar {
    width: 2px;
}

.searchResult::-webkit-scrollbar-thumb {
    background: #ccab48;
    border-radius: 5px;
}
.searchResult::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px #ccab48;
    border-radius: 5px;
}
.searchResult{
    position: absolute;
    padding: 10px !important;
    background: #fff;
    margin-bottom: 0;
    margin-top: 4px;
    z-index:222;
    width: 95%;
   box-shadow: 0px 6px 4px -2px #ccc;
    left: 0;
    max-height: 350px;
    overflow-x: hidden;
    right: 0;
    margin: 2px auto;
}
.crossValue{
  position: absolute;
    right: 20px;
    top: 9px;
    font-size: 20px;
    color: red;
    cursor: pointer;
}
  .dropDown li:last-child {
    box-shadow: none;
  }
  .dropDown li {
    cursor: pointer;
    font-size: 12px;
    padding: 1px 0;
    box-shadow: 0px 1px 0px 0px #ccc;
  }
  .dropDown {
    width: 80px;
    margin: 0;
    padding: 5px !important;
    background: #fff;
    margin-top: 5px;
    box-shadow: 0px 0px 2px 0px;
    position: absolute;
    z-index: 3333;
}
  .pagination-filter{
    box-shadow: 0px 6px 5px -3px #ccc;
  }
  .pagination-slide{
    padding: 2px 5px;
  }
  .paginationWrap{
        right: 16px;
    position: relative;
  }
  .slide span{
    cursor: pointer;
  }
  .filterBlock {
      padding: 10px 8px;
      
  }
  .activeFilter span{
       white-space: nowrap;
    text-overflow: ellipsis;
    width: 80px;
    display: block;
    overflow: hidden;
    position: absolute;
    z-index: 22;
    margin-left: 4px;
    padding-right: 15px;
    height: 27px;
    line-height: 27px;
  }
  .activeFilter i{
        z-index: 0;
    float: right;
    position: absolute;
    right: 7px;
  }
  .activeFilter {
         padding: 0;
    display: flex;
    width: 80px;
    border: 1px solid #ccc;
    font-size: 13px;
    cursor: pointer;
    align-items: center;
    background: #0084cd;
    color: #fff;
    justify-content: space-between;
    height: 27px;
    position: relative;
}
.editBlock > span{
  color: #fff;
  cursor: pointer;
}
.editBlock > span.lnr-cross{
  color: #fb0707;
}
.editBlockChange button{
  background: #0084cd;
    color: #fff;
    border: none;
    margin: 10px auto;
    display: block;
    cursor: pointer;
    padding: 2px 20px;
}
.editBlockChange input{
  display: block;
  width: 100%;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid #ccc

}
.editBlockChange{
    position: absolute;
    left: 0;
    opacity: 0;
    transition: .4s;
    background: #b3b7b4;
    width: 100%;
    z-index: 22;
    padding: 5px;
    display: none;
}

.editBlock{
  position: absolute;
  right: 20px;
  top: 1px;
  z-index: 22;
  background: #ccab48;
  padding: 0 5px;
  border: 1px solid #ccc;
  display: none;
  bottom: 0;
  height: 22px;
  margin: auto;

}
.allWords > li:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: #000;
    margin: auto;
    top: 0;
}
.allWords {
  position: relative;
  padding: 0 10px !important;
  background: #fff;
  margin-bottom: 0;
  overflow-x: hidden;
  height:calc(100% - 122px);
  margin-top: 4px;
}
.allWords::-webkit-scrollbar {
    width: 4px;
}

.allWords::-webkit-scrollbar-thumb {
    background: #b3b7b4;
    border-radius: 5px;
}
.allWords::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 2px #b3b7b4;
    box-shadow: inset 0 0 2px #b3b7b4;
    border-radius: 5px;
}
.allWords .rightItem{
  padding-left: 7px;
  display: block;
}
.allWords > li > span{
        width: 50%;
    padding: 0 5px;
    display: block;
    height: 22px;
    margin: 0.9px 0;
    overflow: auto;
    white-space: nowrap;
}
 .allWords > li > span::-webkit-scrollbar {
    height: 1px;
}

.allWords > li > span::-webkit-scrollbar-thumb {
    background: #8c928d;
    border-radius: 5px;
}
.allWords > li > span::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px #8c928d;
    border-radius: 5px;
}
.allWords > li{
  align-items: center;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding: 0;
  font-size: 12px;
  border-bottom: 1px dotted;
}
.like{
     color: #149632 !important;
    font-weight: 600;
}
</style>
