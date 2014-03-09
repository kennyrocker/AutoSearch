function autoSearch(obj){
    var self = this;

    this.propsObj = {
        idStr : obj.id,
        resultArr : [],
        showBln : false,
        filterResultArr : [],
        filterSetArr : null,
        urlField : obj.urlField
    };
    // if there is fitlerSetArr, then reformat result set on load
    if(arguments[0].filterSetArr){
        this.propsObj.filterSetArr = arguments[0].filterSetArr;
    }

    this.init = function(obj){
        // get all reslut data , should be hocking up through ajax call
        this.propsObj.resultArr = o;
        // call gnerate
        this.generate();
        // call addEvents
        this.addEvents();

        console.log('Raw reslut array => ',self.propsObj.resultArr);

        // if filterSetArr is not null, then filter reuslt
        if(this.propsObj.filterSetArr !== null){
            var obj = {
                data : self.propsObj.resultArr,
                fields : self.propsObj.filterSetArr,
                urlField : self.propsObj.urlField
            };
            self.propsObj.resultArr = self.reformatRawResult(obj);
        }

    };

    this.generate = function(){
        // get input box position x and y
        var offSet = $('#'+this.propsObj.idStr).offset();
        var x = offSet.left;
        var y = offSet.top;
        var h = $('#'+this.propsObj.idStr).outerHeight();
        // define reslut frame div
        var htmlStr = '<div class="serach-result" id="search-result_'+this.propsObj.idStr+'"></div>';
        // draw result frame div inside input
        $('#'+this.propsObj.idStr).parent().append(htmlStr);
        // position this result div by x and y
        $('#search-result_'+this.propsObj.idStr).css('left', x+'px').css('top', y + h +'px');
    };

    this.clearSerachResult = function(){
        // empty reslut frame
        $('#search-result_'+this.propsObj.idStr).html('');
    };

    this.drawSearchResult = function(obj){
        var dataArr = obj;
        // formate output formation
        for( var i = 0; i<dataArr.length; i++){
            // define result item div
            var htmlStr = '<div>'+dataArr[i]+'</div>';
            // append result item div
            $('#search-result_'+self.propsObj.idStr).append(htmlStr);
        }    
    };

    this.addEvents = function(){
        $('#'+this.propsObj.idStr).bind('keyup',function(){
            self.clearSerachResult();
            self.search();
        });
    };

    this.removeEvents = function(){
        $('#'+this.propsObj.idStr).unbind('keyup');
    };

    this.search = function(){
        // check if input is not empty
        if($('#'+this.propsObj.idStr).val()){
            // grab input value
            var valStr = $('#'+this.propsObj.idStr).val();

            console.log('The reformated result array => ',self.propsObj.resultArr);


            // test reformatRawResult method
            //self.drawSearchResult(self.propsObj.resultArr);


        }
    };

    /* DATA REFORMATION 
       
       this method accept an array of object that contains the following properties : 
       @ array of key words arrays 
       @ url string 

       Return an array of object that contain the following properties :
       @ dataArr contains all the related key words
       @ url string
    */
    this.reformatRawResult = function(obj){

        var inArr = obj.data;
        var fieldsArr = obj.fields;
        var url = obj.urlField;
        var outArr = [];

            for(var i = 0; i<inArr.length; i++){

                var tempObj = {};
                var tempKeyWordArr = [];
                var tempUrlStr = '';

                for (var field in inArr[i]){

                    for(var j = 0; j < fieldsArr.length; j++ ){

                        if(fieldsArr[j] == field){

                            var located = inArr[i][fieldsArr[j]];
                            var urlStr = inArr[i][url];

                            // if located is string type
                            if(typeof(located) === 'string'){
                                // push it right in to temp key word array
                                tempKeyWordArr.push(located);
                            }
                            // if located is array type and not empty
                            if(typeof(located) === 'object' && located.length > 0){
                                // loop through it and push all child terms into temp key word array
                                for(var key in located){
                                    tempKeyWordArr.push(located[key]);
                                }
                            }

                            // handling url string
                            if(urlStr !== null) tempUrlStr = urlStr;
                        
                        }
                    }
                }
                // only if tempUrlStr is not empty string
                if(tempUrlStr !== '') {
                    tempObj.dataArr = tempKeyWordArr;
                    tempObj.urlStr = tempUrlStr;
                }
                // only if tempObj has urlStr property
                if(tempObj.hasOwnProperty('urlStr')){
                    outArr.push(tempObj);
                }
            }
        // return formated data    
        return outArr;
    };


    this.destory = function(){

    };

    this.init(obj);

}


  
  // on key up
  // $("#chiefComplaintSelect").keyup(function () {
  //   // if search field input not empty    
  //   if ($(this).val()) {
  //           // input value
  //           var value = $(this).val();
  //           // define regular expression of the input
  //           var exp = new RegExp('^' + value, 'i');
  //           // define global showBln
  //           var showBln;
  //           // define result collection array
  //           var resultCollectionArr = [];


  //           // for item
  //           for ( var i = 0; i<o.length; i++) {
  //               //console.log(o[i]);
  //               //pn, s , t, dt
  //               var isMatch = exp.test(o[i].pn, value);

  //               if(isMatch){ 
  //                   //
  //                   console.log(value + '||' + o[i].pn);
  //                   // add result to reuslt colletction

  //                   // set showBln to true
  //                   showBln = true;
  //               }    

  //           }
  //           // $(o).each(function() {
              
  //           //     var isMatch = exp.test($('.ccOption', this).text());
  //           //     $(this).toggle(isMatch);
  //           //     // if there is a match set global showBln to true
  //           //     if(isMatch) showBln = true;             
  //           // });  


  //           // if global bln is true
  //           if(showBln){       
  //                   // show result
  //                   $('.chiefComplaintSelect').show();


  //                   $('.result').show();    

  //           // else        
  //           }else{
  //                   // hide result
  //                   $('.chiefComplaintSelect').hide();

  //                   $('.result').hide();

  //           }
  //       }
  //       else {
  //           // hide result 
  //           $('.chiefComplaintSelect').hide();

  //           $('.result').hide();
  //       }
  //   });
