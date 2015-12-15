class RE
{
static function JSONstringify(obj) { // implement JSON.stringify serialization
    function escapeEntities(str) {
      var entitiesMap = {             
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };
        return str.replace(/[&<>]/g, function(key) {
            return entitiesMap[key];
        });
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
            if (t == "string") v = '"'+ escapeEntities(v) +'"';
            else if (t == "object" && v !== null) v = JSONstringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
 


 
static function configToPage(config, configName){ // print JSON to page as JavaScript with a specified configName
  var varName = configName || 'config';
  return '<script type="text/javascript">var '+ varName + '=' + JSONstringify(config) +'</script>'
}
   
// used to post custom tags to page via JSON array
/*
// var customTag = [{tag:'paper-button',
//                  attr:{role:'button',
//                        tabindex:'0'},
//                  prop: ['layout'],
//                  content: [{tag:'p',
//                            attr:{
//                               cssclass:"paper-font-subhead" //notice to use 'cssclass' instead of 'class'
//                            },
//                            content:"You now have:"
//                           },
//                            {tag:'paper-fab',
//                            attr:{icon:"add"}
//                            }]
//                 }];
// text.Output.Append(RE.json2html(customTag));
//
// will produce this on page:
// <paper-button role="button" tabindex="0" layout><p class="paper-font-subhead" >You now have:</p><paper-fab icon="add" ></paper-fab></paper-button>
*/
  
static function json2html(obj){
    var key, val, tag="", html:String, content: String="",  attrs = [],tempattr, tempkey, props = [];
  	var t = typeof (obj);
    //log.LogDebug(t + obj);
    if (t != "object" && t != "array" || obj === null) {
        if (t == "string" ) return String(obj);
    } else if(obj && obj.constructor == Array) {
      for(var i=0;i<obj.length;i++){
        return json2html(obj[i]);
      }
    } else {
      for (key in obj){
      	val=obj[key]; t = typeof(val);
        if(key == "tag" && t == "string"){tag = val}
        if(key == "attr" && t== "object"){
           for(tempkey in val){
             tempattr = val[tempkey];
             attrs.push((tempkey=='cssclass'?'class':tempkey) +"='"+tempattr+"'");//compensate for reserved 'class'
           }
         }
        if (key =="prop" && val.constructor == Array){ //for props
          for (var ai=0;ai<val.length;ai++) {props.push(String(val[ai]))};              
        }
        if(key=="content" && val!== null){
          if(t == 'object' && val.constructor == Array){
             for(var ci=0;ci<val.length;ci++){
             content+= json2html(val[ci]);
            }
          } else {content= json2html(val)}
        }
       }
      return '<'+tag+' '+attrs.join(' ')+' '+props.join(' ')+'>'+content+'</'+tag+'>';
    }   
};
  
}
