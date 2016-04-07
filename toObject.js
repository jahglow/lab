class toObject {
    static var entities = {
        table:{},
        chart:{}
    };

    static var G = {
        pageContext: {},
        report: {},
        user: {},
        state: {},
        confirmit: {},
        log: {}
    };


    /**
     * @param {String} tableID - ID of the table that will be output to JSON
     * @param {Number} precision - Number of decimal digits. Pass null if the bumber should stay intact.
     * @return {{colHeaders:Object, rowHeaders:Object, data:Array}}
     */
    static function fromTable(tableID, precision){
        var colHeaders = G.report.TableUtils.GetColumnHeaderCategoryTitles(tableID);
        var rowHeaders = G.report.TableUtils.GetRowHeaderCategoryTitles(tableID);
        var data = [], i=0;
    
        /**
         * @param {Number} value - value from cell, generally a Float
         * @param {Number} precision - Number of decimal digits. Pass null if the bumber should stay intact.
         * @param {Boolean} isPercent - specify whether this is a percent value.
         * @return {Number} value
         */
        function _normalizeValue(value, precision, isPercent){
            var isPercent=isPercent||false;
            if(precision && value!==0 && !isPercent && String(value).indexOf('.')!==-1){
                return value.toFixed(precision);
            } else if(isPercent){
                return  (value.toFixed(precision + 2) * 100 ).ToString() + '%';
            } else {
                return parseFloat(value);
            }
        }
    
        for(i=1; i<=rowHeaders.length; i++){
            var rawRow = {};
            //we need to check for distributions, if none use `count` as default
            if(entities.table.hasOwnProperty(tableID)){
                var t = entities.table[tableID];
                if(t.Distribution.Count){rawRow.basecount = G.report.TableUtils.GetRowValues(tableID, i, IndexBaseType.FromStart, DatapointType.Count);}
                if(t.Distribution.HorizontalPercents){rawRow.hp = G.report.TableUtils.GetRowValues(tableID, i, IndexBaseType.FromStart, DatapointType.HorizontalPercent);}
                if(t.Distribution.VerticalPercents){rawRow.vp = G.report.TableUtils.GetRowValues(tableID, i, IndexBaseType.FromStart, DatapointType.VerticalPercent);}
            } else {
                rawRow.basecount = G.report.TableUtils.GetRowValues(tableID, i);
            }
            var row = {};
            for(var DT in rawRow){
                if(!row.hasOwnProperty(DT)){row[DT] = [];}
                for(var d=0; d<rawRow[DT].length; d++){
                    row[DT].push(_normalizeValue(rawRow[DT][d].Value, precision, DT!=='basecount'))
                }
            }
            // we can't know if the table is the value is collapsed, of it is all values will be the same, we may delete obsolete
            if(row.hp && row.vp && row.hp.ToString()===row.vp.ToString()){
                delete row['hp'];delete row['vp'];
            }
            data.push(row);
        }
    
        var colheaders=[],rowheaders=[];
    
        for (i=0; i < colHeaders.length; i++) {
            leafToTree(colHeaders[i].reverse(),colheaders);
        }
        for (i=0; i < rowHeaders.length; i++) {
            leafToTree(rowHeaders[i].reverse(),rowheaders);
        }
    
        return {data:data,rowheaders:rowheaders,colheaders:colheaders};
    }


    /**
     * @param {Array} steps - Array of titles starting from parent to children (reversed)
     * @param {Array} global - empty array to host the tree objects
     */
    private static function leafToTree(steps, global) {
        var current = null, existing = null, curLength=0;
        for (var y = 0; y < steps.length; y++) {
            if (y==0) {current = global}
            existing = null; curLength = current.length;
            while (curLength--) {
                if (current[curLength].text === steps[y]) { existing = current[curLength]; break;}
            }
            if (existing) {
                current = existing.subcells;
            } else {
                if(y!==steps.length-1){
                    current.push({ text: steps[y], subcells: [] });
                    current = current[current.length - 1].subcells;
                } else {
                    current.push({ text: steps[y]});
                }
            }
        }
    }
}