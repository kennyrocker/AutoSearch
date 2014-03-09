function autoSearch(obj){

    var self = this;

    this.propsObj = {
        idStr : obj.idStr,
        resultArr : obj.dataArr, // raw set
        placeHolderStr : obj.placeHolderStr,
        maxMatchNum : 20, // the longest match interested in
        showBln : false,
        matchArr : [], // matched set
        dropdownSelectedBln : false // indicate arrow position is at the very top
    };

    this.init = function(obj){
        // call gnerate
        this.generate();
        // call addEvents
        this.addEvents();
    };

    this.generate = function(){
      // define search box stucture
      var tmplStr = '<input id="'+this.propsObj.idStr+'_input" class="auto-search-input" placeholder="'+this.propsObj.placeHolderStr+'"/>';
      tmplStr    += '<div id="'+this.propsObj.idStr+'_suggest_result" class="auto-search-suggestion"></div>';
      tmplStr    += '<div id="'+this.propsObj.idStr+'_result" class="auto-search-result"></div>';
      // draw structure
      $('#'+this.propsObj.idStr).html(tmplStr);
      // hide result div
      this.hideDropDown();
    };

    this.resetResult = function(){
      this.propsObj.matchArr = [];
    };

    this.clearSerachResult = function(){
      // clear result ouputs
      $('#'+this.propsObj.idStr+'_result').html('');
      $('#'+this.propsObj.idStr+'_suggest_result').html('');
    };

    this.drawResult = function(){
      var r = this.propsObj.matchArr;
      if(r.length > 0){
          for (var i = 0; i < r.length; i++) {
              if(i === 0){
                var eleStr = '<div class="item suggest-reuslt"><a href="'+r[i].urlStr+'">'+r[i].termStr+'</div>';
                $('#'+self.propsObj.idStr+'_suggest_result').append(eleStr);
              }else{
                var eleStr = '<div class="item index-'+(i-1)+'"><a href="'+r[i].urlStr+'">'+r[i].termStr+'</div>';
                $('#'+self.propsObj.idStr+'_result').append(eleStr);
              }
          }
      }
      if(r.length > 1){    
          self.showDropDown();
      }else{
          self.hideDropDown();
      }
    };

    this.hideDropDown = function(){
      $('#'+this.propsObj.idStr+'_result').hide();
    };

    this.showDropDown = function(){
      $('#'+this.propsObj.idStr+'_result').show();
    };

    this.addEvents = function(){
        // on input key up
        $('#'+this.propsObj.idStr+'_input').bind('keyup',function(e){
            // keyup event keyCode   
            var keyCode = e.keyCode || e.which;
            // if input is not empty
            if($(this).val()){
                // if keystroke are not left 37 / up 38 / right 39 / down 40 / enther 13
                if(keyCode !== 37 && keyCode !== 38 && keyCode !== 39 && keyCode !== 40 && keyCode !== 13){
                    // get input value
                    var value = $(this).val();
                    // call initSearch
                    self.initSearch({valueStr:value});
                }
            }else{
                self.killSearch();
            }
        });

        // on input key down
        $('#'+this.propsObj.idStr+'_input').bind('keydown',function(e){
            // keyup event keyCode   
            var keyCode = e.keyCode || e.which;
            // if input is not empty
            if($(this).val()){
        
                var value = $(this).val();
                switch(keyCode){
                  case 37 : // left
                    self.arrowLeftRight({keyCode:37, currentInput:value});
                  break;
                  case 38 : // up
                    self.arrowUpDown({keyCode:38, currentInput:value});
                  break;
                  case 39 :// right
                    self.arrowLeftRight({keyCode:39, currentInput:value});
                  break;
                  case 40 : // down
                    self.arrowUpDown({keyCode:40, currentInput:value});
                  break;
                  case 13 : // enter
                    self.enter();
                  break;
                }
            
            }else{
                self.killSearch();
            }
        });
    };

    this.removeEvents = function(){
      $('#'+this.propsObj.idStr+'_input').unbind('keyup');

      $('#'+this.propsObj.idStr+'_input').bind('keydown');
    };

    this.initSearch = function(obj){
        // reset dropDownBln to false
        self.propsObj.dropDownBln = false;
        // call clear search result
        self.clearSerachResult();
        // reset matchArr
        self.resetResult();
        // call search with value 
        self.search({termStr:obj.valueStr});
    };

    this.killSearch = function(){
        self.clearSerachResult();
        self.hideDropDown();
    };

    this.search = function(obj){
        // get updated result pool array 
        /* should be allow to modify on the fly later */
        var resultPoolArr = self.propsObj.resultArr;
        // check if ther is space    
        if(!/\s/.test(obj.termStr)){
            self.singleWordSearch({ termStr:obj.termStr, resultPoolArr:resultPoolArr});
        }else{
            self.sentanceSearch({ termStr:obj.termStr, resultPoolArr:resultPoolArr});
        }
    };

    /* SINGLE WORD SEARCH */
    this.singleWordSearch = function(obj){      
        // define regular expression of the search term
        var exp;
        try {
          exp = new RegExp('^' + obj.termStr, 'i');
        } catch (e) { // remove console log in production code
          //console.log(e);
          return false;
        }
        // for each reslut item from reult pool
        for (var i = 0; i < obj.resultPoolArr.length; i++) {
            // get term string from pool
            var termStr = obj.resultPoolArr[i].termStr;
            // check if term from pool match input term
            var matchBln = exp.test(termStr, obj.termStr);
            if(matchBln){
              var r = { termStr:termStr, urlStr:obj.resultPoolArr[i].urlStr };
              self.propsObj.matchArr.push(r);
            }
        }
        // call drawResult
        self.drawResult();
    };

    /* SENTANCE SEARCH */
    this.sentanceSearch = function(obj){
        var termStr = obj.termStr;
        // if maxSearchNum 
        if(self.propsObj.maxSearchNum){
          // TODO LATER
        }
        // break single search term by space
        var words = (termStr).split(' ');
        // incremental match array hold combination of search terms     
        for(var x = words.length-2; x >= 0; x--) {
            words[x] = words[x] + ' ' + words[x+1];
        }
        var matches = [];
        // check in reverse order to have most relevant matches up front
        for(var i = 0; i<words.length; i++) {
            for(var j= 0; j < obj.resultPoolArr.length; j++){
                // get term string from pool
                var termStr = obj.resultPoolArr[j].termStr;
                if(words[i].length>=2 && termStr.indexOf(words[i])!==-1) {
                    if(matches.indexOf(termStr)==-1) {
                        matches.push(termStr);
                        // store it
                        var r = { termStr:termStr, urlStr:obj.resultPoolArr[j].urlStr };
                        self.propsObj.matchArr.push(r);
                    }   
                }
            }
        }
        // call drawResult
        self.drawResult();
    };

    this.arrowLeftRight = function(obj){
        // if there is matched result
        if(this.propsObj.matchArr[0]){
            var hintObj = self.propsObj.matchArr[0];
            if(obj.keyCode == 37){// left 
                var newTerm = self.compareAddRemove({currentInputStr:obj.currentInput, hintStr:hintObj.termStr, actionStr:'remove'});
                $('#'+self.propsObj.idStr+'_input').val(newTerm);
                // only reinitSearch if currentInput length larger than 1
                if(obj.currentInput.length > 1) {
                  self.initSearch({valueStr:newTerm});
                }else{
                  self.killSearch();
                }
            }else{ // right
                // compare current input against hint termStr 
                var newTerm = self.compareAddRemove({currentInputStr:obj.currentInput, hintStr:hintObj.termStr, actionStr:'add'});
                // update input value with new term
                $('#'+self.propsObj.idStr+'_input').val(newTerm);
                // call initSearch with new term
                self.initSearch({valueStr:newTerm});
            }
        }
    };

    this.arrowUpDown = function(obj){
        // if there is more than one matched result
        if(self.propsObj.matchArr.length > 1){   
            // dropwdown div item total
            var itemTotalNum = $('#'+self.propsObj.idStr+'_result > div.item').length;
            // if keyCode is down
            if(obj.keyCode == 40){
                // if arrowUpBln is flase (meaning arrow index is at input)
                if(self.propsObj.dropdownSelectedBln === false){ // this is index 0
                    // call select dropdown item / hard code to selec the first item of the result dropdown div
                    self.selectDropdownItem({indexNum:0});
                    // set arrowUpBln to true
                    self.propsObj.dropdownSelectedBln = true;
                } else { // if arrowUpBln is true 
                    // grab selected class index number
                    var selectedIndexNum = -1;
                    // check all dropdown items see which one is has selected class
                    $('#'+self.propsObj.idStr+'_result .item').each(function(i){
                        if($(this).hasClass('selected-item')) selectedIndexNum = i;
                    });
                    // call select selectDropdownItem with crrent index plus 1
                    var nextIndexDown = selectedIndexNum + 1;
                    if(nextIndexDown < itemTotalNum) {
                      self.selectDropdownItem({indexNum:nextIndexDown});
                    }
                }
             } else {              
                // if keyCode is up
                if(self.propsObj.dropdownSelectedBln === true){ // this is not index 0
                    var selectedIndexNum = -1;
                    $('#'+self.propsObj.idStr+'_result .item').each(function(i){
                        if($(this).hasClass('selected-item')) selectedIndexNum = i;
                    });
                    var lastIndexDown = selectedIndexNum - 1;
                    if(lastIndexDown > -1 ) {
                      self.selectDropdownItem({indexNum:lastIndexDown});
                    }else{
                      self.propsObj.dropdownSelectedBln = false;
                    }
                    if(lastIndexDown == -1){
                      self.deSelectDropdownItem();
                    }
                }else{
                  // should highlight ther input box?
                  self.deSelectDropdownItem();
                }
            }
        }
    };

    this.enter = function(){
        // if input box 
        if(self.propsObj.dropdownSelectedBln === true){
            // grab value from selected item
            var selectVal = '';
            $('#'+self.propsObj.idStr+'_result .item').each(function(i){
                if($(this).hasClass('selected-item')) selectVal = $(this).context.innerText;
            });
            // change input value to select value
            $('#'+this.propsObj.idStr+'_input').val(selectVal);
            // kill serach
            self.killSearch();
        } else { // this is the input level
            // populate input with the sugguested hint text
            var sugguestedStr = self.propsObj.matchArr[0].termStr;
            $('#'+this.propsObj.idStr+'_input').val(sugguestedStr);
            self.killSearch();
        }
    };

    this.deSelectDropdownItem = function(){
        $('#'+self.propsObj.idStr+'_result .item').removeClass('selected-item');
    };

    this.selectDropdownItem = function(obj){
        $('#'+self.propsObj.idStr+'_result .item').removeClass('selected-item');
        $('#'+self.propsObj.idStr+'_result .index-'+obj.indexNum).addClass('selected-item');
    };


    this.compareAddRemove = function(obj){
        var shortStr = obj.currentInputStr;
        var longStr = obj.hintStr;
        var actionStr = obj.actionStr;
        // find out the index of short string within long string
        var indexNum = longStr.indexOf(shortStr);
        var length = shortStr.length;
        var newIndex = indexNum + length;
        if(actionStr == 'add'){ // add
          return longStr.substring(indexNum,newIndex+1);
        } else { // remove
          return longStr.substring(indexNum,newIndex-1);
        }
    };

    this.destory = function(){
        this.removeEvents();
    };
    // constructor
    this.init(obj);
}
