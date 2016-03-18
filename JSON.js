class JSON
{
static function stringify(obj) { // implement JSON.stringify serialization
    function escapeEntities(str) {
      var entitiesMap = {             
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '\"': '\\&quot;',
            '\'':'&amp;apos;'
        };
        return str.replace(/[&<>\"\']/g, function(key) {
            return entitiesMap[key];
        });
    }
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"'+ escapeEntities(obj) +'"';
      else if(t=="number") obj = '"'+obj+'"'; 
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof(v);
          if (t == "string"){
            v = '"'+ escapeEntities(v) +'"';
          }
            else if (t == "object" && v !== null) v = stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
      return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};
 
  
/**
* var customTag = [{tag:'paper-button',
*                  attr:{role:'button',
*                        tabindex:'0'},
*                  prop: ['layout'],
*                  content: [{tag:'p',
*                            attr:{
*                               cssclass:"paper-font-subhead" //notice to use 'cssclass' instead of 'class'
*                            },
*                            content:"You now have:"
*                          },
*                            {tag:'paper-fab',
*                            attr:{icon:"add"}
*                            }]
*                 }];
* text.Output.Append(JSON.toTag(customTag));
*
* will produce this on page:
*  <paper-button role="button" tabindex="0" layout>
*     <p class="paper-font-subhead" >You now have:</p>
*     <paper-fab icon="add" ></paper-fab>
*  </paper-button>
*/

  static function toTag(obj, log){ // JSO.toTag is used to post custom tags to page via JSON array
    var key, val, tag="", html:String, content: String="",  attrs = [],tempattr, tempkey, props = [];
  	var t = typeof (obj);
    if (t != "object" && t != "array" || obj === null) {
        if (t == "string" ) return String(obj);
    } else if(obj && obj.constructor == Array) {
      for(var i=0;i<obj.length;i++){
        return toTag(obj[i]);
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
             content+= toTag(val[ci]);
            }
          } else {content= toTag(val)}
        }
       }
      return '<'+tag+' '+attrs.join(' ')+' '+props.join(' ')+'>'+content+'</'+tag+'>';
      
    }   
};

  static function print(config, configName){ // JSON.print prints JSON `config` to page as JavaScript variable with a specified `configName`
  var varName = configName || 'config';
    return '<script type="text/javascript">var '+ varName + '=' + stringify(config) +'</script>';
  };
}
