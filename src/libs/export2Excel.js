require('script-loader!file-saver');
import XLSX from 'yxg-xlsx-style';
console.log("加载了export2Excel");

function generateArray(table) {
    var out = [];
    var rows = table.querySelectorAll('tr');
    var ranges = [];
    for (var R = 0; R < rows.length; ++R) {
        var outRow = [];
        var row = rows[R];
        var columns = row.querySelectorAll('td');
        for (var C = 0; C < columns.length; ++C) {
            var cell = columns[C];
            var colspan = cell.getAttribute('colspan');
            var rowspan = cell.getAttribute('rowspan');
            var cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function(range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({
                    s: {
                        r: R,
                        c: outRow.length
                    },
                    e: {
                        r: R + rowspan - 1,
                        c: outRow.length + colspan - 1
                    }
                });
            }

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan)
                for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
}

function datenum(v, date1904) {
    if (date1904) v += 1462;
    var epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    var ws = {};
    var range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (var R = 0; R != data.length; ++R) {
        for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            var cell = {
                v: data[R][C]
            };
            if (cell.v == null) continue;
            var cell_ref = XLSX.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function export_table_to_excel(id) {
    var theTable = document.getElementById(id);
    var oo = generateArray(theTable);
    var ranges = oo[1];

    /* original data */
    var data = oo[0];
    var ws_name = "SheetJS";

    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    })

    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), "test.xlsx")
}

export const export_json_to_excel_receive = ({
    setMealIndex,
    addMealIndex,
    supplementIndex,
    title,
    multiHeader = [],
    header,
    data,
    filename,
    merges = [],
    autoWidth = true,
    bookType = 'xlsx'
} = {}) => {
    /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header);
    data.unshift(title);
    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    var ws_name = "SheetJS";
    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data);

    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }

    if (autoWidth) {
        /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map(val => {
                /*先判断是否为null/undefined*/
                if (val == null) {
                    return {
                        'wch': 20
                    };
                }
                /*再判断是否为中文*/
                else if (val.toString().charCodeAt(0) > 255) {
                    return {
                        'wch': val.toString().length * 1.5
                    };
                } else {
                    return {
                        'wch': val.toString().length
                    };
                }
            }))
            /*以第一行为初始值*/
        let result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var dataInfo = wb.Sheets[wb.SheetNames[0]];

    const borderAll = { //单元格外侧框线
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        },
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        }
    };

    //给所以单元格加上边框
    for (var i in dataInfo) {
        if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1' || i == 'A2' || i == 'B1' || i == 'B2' || i == 'C1' || i == 'C2' || i == 'D1' || i == 'D2' || i == 'E1' || i == 'E2' || i == 'A9' || i == 'A10' || i == 'B9' || i == 'B10' || i == 'C9' || i == 'C10' || i == 'D9' || i == 'D10' || i == 'E9' || i == 'E10') {} else {
            dataInfo[i + ''].s = {
                border: borderAll,
                alignment: {
                    horizontal: 'right',
                    wrapText: true
                }
            }
        }
    }
    let listAbc = ["A", 'B', "C", "D", "E"];
    let num = 9 + setMealIndex + addMealIndex + (supplementIndex == 1 ? 0 : supplementIndex + 2);
    console.log(setMealIndex)
    console.log(addMealIndex)
    console.log(supplementIndex)
    console.log(num)
    for (let i = 9; i < num; i++) {
        if (i !== 9 + setMealIndex && i !== 9 + setMealIndex + 1 && i !== 9 && i !== 10 && i !== 9 + setMealIndex + addMealIndex && i !== 9 + setMealIndex + addMealIndex + 1) {
            for (let item of listAbc) {
                dataInfo[`${item}${i}`].s = {
                    border: borderAll,
                    alignment: {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true
                    }
                }
            }
        } else {
            for (let item of listAbc) {
                dataInfo[`${item}${i}`].s = {
                    border: {},
                    alignment: {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true
                    }
                }
                if (
                    setMealIndex && i == 9 + setMealIndex + 1 || i == 9 || i == 10) {
                    dataInfo[`${item}${i}`].s = {
                        font: {
                            sz: 13,
                            bold: true,
                            color: { rgb: "000" },
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                            wrapText: true
                        }
                    }
                }
                if (addMealIndex && i == 9 + setMealIndex + 1 + addMealIndex + 1) {
                    dataInfo[`${item}${i}`].s = {
                        font: {
                            sz: 13,
                            bold: true,
                            color: { rgb: "000" },
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                            wrapText: true
                        }
                    }
                }
                if (supplementIndex > 1 && i == 9 + setMealIndex + 1 + addMealIndex + 1 + supplementIndex) {
                    dataInfo[`${item}${i}`].s = {
                        font: {
                            sz: 13,
                            bold: true,
                            color: { rgb: "000" },
                        },
                        alignment: {
                            horizontal: "center",
                            vertical: "center",
                            wrapText: true
                        }
                    }
                }
            }
        }
    }

    // 去掉标题边框
    let arr = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1"];
    arr.some(function(v) {
        let a = merges[0].split(':')
        if (v == a[1]) {
            dataInfo[v].s = {}
            return true;
        } else {
            dataInfo[v].s = {}
        }
    })
    ws['!cols'] = ([{
            wpx: 100
        }, {
            wpx: 150
        }, {
            wpx: 100
        }, {
            wpx: 100
        }, {
            wpx: 100
        }])
        // ws['!rows'] = ([{
        //         hpt: 100
        //     }, {
        //         hpt: 300
        //     }])
        //设置主标题样式
    dataInfo["A1"].s = {
        font: {
            name: '宋体',
            sz: 13,
            color: { rgb: "000" },
            // italic: false,
            // underline: false
        },
        alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
        },
        // fill: {
        //     fgColor: { rgb: "000" },
        // },
    };
    dataInfo["A2"].s = {
        font: {
            name: '宋体',
            sz: 20,
            color: { rgb: "000" },
            bold: true,
            // italic: false,
            // underline: false
        },
        alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
        },
        // fill: {
        //     fgColor: { rgb: "000" },
        // },
    };
    let listArr = ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']
    let listArr1 = ['B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']
        // console.log(merges)
        // console.log(dataInfo)
    for (let i = 0; i < listArr.length; i++) {
        dataInfo[`${listArr[i]}`].s = {
            font: {
                sz: 11,
                color: { rgb: "000" },

            },
            border: borderAll,
            alignment: {
                horizontal: "right",
                vertical: "center",
                wrapText: true
            },

        };
        dataInfo[listArr1[i]].s = {
            font: {
                sz: 11,
                color: { rgb: "000" },
            },
            border: borderAll,
            alignment: {
                horizontal: "right",
                vertical: "center",
                wrapText: true
            },

        }
    }
    var wbout = XLSX.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}
export const export_json_to_excel_access = ({
    title,
    multiHeader = [],
    header,
    data,
    filename,
    merges = [],
    autoWidth = true,
    bookType = 'xlsx'
} = {}) => {
    /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header);
    data.unshift(title);
    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    var ws_name = "SheetJS";
    var wb = new Workbook(),
        ws = sheet_from_array_of_arrays(data);

    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var dataInfo = wb.Sheets[wb.SheetNames[0]];

    const borderAll = { //单元格外侧框线
        top: {
            style: 'thin'
        },
        bottom: {
            style: 'thin'
        },
        left: {
            style: 'thin'
        },
        right: {
            style: 'thin'
        }
    };

    //给所以单元格加上边框
    for (var i in dataInfo) {
        if (i == '!ref' || i == '!merges' || i == '!cols' || i == 'A1' || i == 'B1' || i == 'C1' || i == 'D1' || i == 'E1' || i == 'F1' || i == 'G1' || i == 'H1' || i == 'I1' || i == 'A2' || i == 'B2' || i == 'C2' || i == 'D2' || i == 'E2' || i == 'F2' || i == 'G2' || i == 'H2' || i == 'I2') {} else {
            dataInfo[i + ''].s = {
                font: {
                    sz: 10
                },
                border: borderAll,
                alignment: {
                    horizontal: 'center',
                    wrapText: true
                }
            }
        }
    }
    ws['!cols'] = ([{
            wpx: 55
        }, {
            wpx: 50
        }, {
            wpx: 55
        }, {
            wpx: 55
        }, {
            wpx: 55
        }, {
            wpx: 55
        }, {
            wpx: 75
        }, {
            wpx: 50
        }, {
            wpx: 95
        }])
        // 去掉标题边框
    let arr = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1"];
    arr.some(function(v) {
            let a = merges[0].split(':')
            if (v == a[1]) {
                // dataInfo[v].s = {}
                return true;
            } else {
                // dataInfo[v].s = {}
            }
        })
        //设置主标题样式
    dataInfo["A1"].s = {
        font: {
            name: '宋体',
            sz: 13,
            color: { rgb: "000" },
            // italic: false,
            // underline: false
        },
        alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
        },
        // fill: {
        //     fgColor: { rgb: "000" },
        // },
    };
    dataInfo["A2"].s = {
        font: {
            name: '宋体',
            sz: 20,
            color: { rgb: "000" },
            bold: true,
            // italic: false,
            // underline: false
        },
        alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true
        },
        // fill: {
        //     fgColor: { rgb: "000" },
        // },
    };

    var wbout = XLSX.write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}