<template>
    <div class="addWordBlock">
      <h3 class="text-center mb-3">Add Word</h3>
      <form @submit.prevent="addWord">  
        <div class="form-group" @click="inputFocus($event)">
          <label for="english" ref="downLabel1">English</label>
          <input type="text" id="english" class="form-control focusoutInput" v-model="english" @blur="labelDown($event)" @focus="labelSame($event)" required>
        </div>
        <div class="form-group" @click="inputFocus($event)">
          <label for="armenian" ref="downLabel2">Armenian</label>
          <input type="text" id="armenian" class="form-control focusoutInput" v-model="armenian" @blur="labelDown($event)"  @focus="labelSame($event)" required>
        </div>
        <input type="submit" value="Add Word" class="addButton">
      </form> 
    </div>
</template>
<script>
import db from '../main.js'
export default {
  name: 'AddWord',
  data () {
    return {
      english:'',
      armenian:'',
      
    }
  },

  methods:{
    addWord(){
      const slug = this.generateUUID()
      if(this.armenian != "" && this.english != ""){
        db.collection('words').add({
          english: this.english,
          armenian: this.armenian,
          isLearned: false,
          publication:(new Date()).getTime()
        })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
          this.$refs.downLabel1.style = {top:'6px', fontSize:'14px'}
          this.$refs.downLabel2.style = {top:'6px', fontSize:'14px'}
          this.english = ''
          this.armenian = '';
          [].slice.call(Array.from(document.querySelectorAll('.focusoutInput'))).forEach(elem => {
            elem.blur()
          })
          // console.log(this.downLabel = {})
          // this.$router.push(`/${slug}/success`)
        })
        .catch(function (error) {
          console.error('Error adding document: ', error)
        })
      }      
    },
    generateUUID () {
      let d = new Date().getTime()
      let uuid = 'AIzaSyCLv_TP1M3gmi_LNmMOQ43EjLWpCAlv-jQ'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
      return uuid
    },
    labelSame(event){
       Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
        event.target.parentElement.children[0].style.top = -21+'px'
        event.target.parentElement.children[0].style.fontSize = 12+'px';
      })
    },
    inputFocus(event){
      Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
        event.target.parentElement.children[0].style.top = -21+'px'
        event.target.parentElement.children[0].style.fontSize = 12+'px';
      })
    },
    labelDown(event){
      if(event.target.value == ''){
        Array.prototype.map.call(event.target.parentElement.children, (elm, ind)=>{
          event.target.parentElement.children[0].style.top = 6+'px'
          event.target.parentElement.children[0].style.fontSize = 15+'px';
        })
      }
    }
  }
}

</script>
<style>
.addWordBlock{
  padding: 25px;
  background: none;
}
 .addButton{
    background: #0084cd;
    border: 0;
    color: #fff;
    font-size: 13px;
    width: 85px !important;
    margin: auto;
    display: block;
    padding: 5px;
    cursor: pointer;
  }
 .form-group {
    margin-top: 25px;
  position: relative;
}
.form-group label{
    position: absolute;
    top: 6px;
    left: 10px;
    font-size:15px; 
    transition: .4s;
    color: #929696;
}
</style>
