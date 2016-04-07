# lab
this lab includes reusable Codelibrary Scripts by Ivan Pilyugin

### `JSON`
`JSON` class implements `JSON.serialize` polyfill for JScript which allows to output JScript objects and Arrays as JSON.
Besides it has a `JSON.toTag` function that converts an objec to a seres of nested HTML tags.

Example:

```javascript
var customTag = [{tag:'paper-button',
                  attr:{role:'button',
                        tabindex:'0'},
                  prop: ['layout'],
                  content: [{tag:'p',
                            attr:{
                               cssclass:"paper-font-subhead" //notice to use 'cssclass' instead of 'class'
                            },
                            content:"You now have:"
                          },
                            {tag:'paper-fab',
                            attr:{icon:"add"}
                            }]
                 }];
 text.Output.Append(JSON.toTag(customTag));
```
 will produce this on page:
```html
  <paper-button role="button" tabindex="0" layout>
     <p class="paper-font-subhead" >You now have:</p>
     <paper-fab icon="add" ></paper-fab>
  </paper-button>
```

`JSON.print` allows to output the JSON string into a script tag and assign it to a variable.

### `toObject`

`toObject.fromTable` renders an object from an aggregated table. 
Output structure:
```javascript
{
  "data":[{"basecount":[3,..1],"hp":["18.75%",..."6.25%"],"vp":["23.08%",..."16.67%"]},{...}],
  "rowheaders":[{"text":"NPS"},...{"text":"OSat"}],
  "colheaders":[{
    "text":"Russia",
    "subcells":[{"text":"male"},{"text":"female"}]
    },{
    "text":"France",
    "subcells":[{"text":"male"},{"text":"female"}]
    },{...}]
}
```
`toObject` requires configuring `entities.table` and `G` variables beforehand:

* in page script on every page which will call it: 
```javascript
  toObject.G = {report: report,
    user: user,
    state: state,
    confirmit: confirmit,
    log: log
  };
```
* in the AggregatedTable script: 
```javascript
toObject.entities.table[table.Name] = table;
```
* then in a text component you may execute Table to Object generation (first parameter is `tableID` and second is how many `deciaml digits` to allow):
```javascript
toObject.fromTable('table2', 2)
```

to print it as JSON to a Javascript variable `myJSONobject` to a page call:
```javascript
JSON.print( toObject.fromTable('table2', 2), 'myJSONobject' );
```
