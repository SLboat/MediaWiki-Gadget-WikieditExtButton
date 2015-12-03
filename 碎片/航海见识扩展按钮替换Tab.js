//源码外的小工具
//整理tab
var toolBarTabTools = {
	getSpace: function (str, useTab){
		if (typeof(useTab)=="undefined") useTab = false
		var len = 0;
		var match; //空格
		if (useTab){
			match = str.match(/^(\t+)/); //空格
		}else{
			match = str.match(/^( +)/); //空格
		}
		if (match) {
			len = match[0].length;
		} 
		return len;
	},
	getLessSpace: function getLessSpace(str, useTab){
		if (typeof(useTab) == "undefined") useTab = false
		var allLine = str.split(/[\r\n]/)
		var smallSpace = -1
		if (allLine.length > 0){
			for (i=0;i<allLine.length;i++){
				var line = allLine[i]
				var spaces = this.getSpace(line, useTab)
				if (smallSpace == -1){
					smallSpace = spaces
				}else if(spaces < smallSpace){
					smallSpace = spaces;
				}
			}
		}
		return smallSpace;
	},
	deleteSpaces: function (str, spaces, useTab){
		var allLine = str.split(/[\r\n]/)
		var spacesReg = new RegExp("^" + (useTab ? "\t":" ").repeat(spaces))
		if (allLine.length > 0){
			for (i=0;i<allLine.length;i++){
				allLine[i] = allLine[i].replace(spacesReg,"") //除掉空白
			}
			return allLine.join("\n")
		}
		return str //咋来就咋回去
	},
	//主入口
	clearSource: function (str){
		var less = this.getLessSpace(str, false)
		if (less > 1){
		    return this.deleteSpaces(str, less, false)
		}else{
		  less = this.getLessSpace(str, true)
          return this.deleteSpaces(str, less, true)
		}
	},
	replaceText: function(old, replace){ //替换编辑框,但愿不会用到.
	    var textarea = $("#wpTextbox1");
		var len = textarea.value.length;
		var sel_start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		var sel = textarea.value.substring(start, end);		 
		textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
	},
	doTheJob: function (source_Tag) {
		 if (typeof(source_Tag) == "undefined") source_Tag = "";
	     var sel = $("#wpTextbox1").textSelection("getSelection");
         var textarea = $("#wpTextbox1")[0];
	     if (!sel){
	         return;
	     }
		 var sel_start = textarea.selectionStart;
	     var newText = this.clearSource(sel)
	     if (source_Tag.length > 0){ //想法:或许不用比较也可以
	     	newText = "<source lang=\"" + source_Tag + "\">\n" + newText + '\n</source>'
	     }
	     if (sel != newText){
	         if (document.queryCommandSupported('insertText') && document.queryCommandSupported('delete')){
	         	 $("#wpTextbox1").focus();
	             document.execCommand('delete');
	             document.execCommand('insertText', false, newText);
	             //重新选择
	             //TODO: 内置函数如何
	             textarea.selectionStart = sel_start;
	             textarea.selectionEnd = sel_start + newText.length;
	         }//TODO: 旧版本替换
	     }
	}
}


var t = toolBarTabTools

//获得选中
src = $("#wpTextbox1").textSelection("getSelection")
console.log("选中内容:\n",src)
//取得最小
less = t.getLessSpace(src)
console.log("最小空格: ",less)

news = t.clearSource(src)
console.log("切割后:\n",news)


t.doTheJob()


var currTextIsInSource = {
	editor: $("#wpTextbox1"), //编辑器
	currPos: function(){ //开始位置
		return this.editor.prop("selectionStart");
	},
	endPos: function(){
		return this.editor.prop("selectionEnd");
	},
	allTxt: function(){
		return this.editor.val()
    },
	beforeText: function(len){ //获得之前的文字
		var cupos = this.currPos();
		return this.allTxt().substring(this.cupos - len, cupos);
	},
	afterText: function(len){ //获得之后的文字
		var cupos = this.currPos();
		return this.allTxt().substring(cupos, cupos + len);
	},
	isVaild: function(){ //检查是在源码里
		//检查没有选中
		if (this.currPos() != this.endPos()){
			return false;
		}
		//检查前面是sourcexxx+换行
		if (this.beforeText(45).search(/\<source lang=\".+\"\>\n$/) < 0){ //必须是结尾
			return false;
		}
		//检查后面是</source>
		if (this.afterText(15).search(/\n<\/source>/) != 0){
			return false;
		}
		//返回结果
		return true;
	},
	pasteBoardTool: { //剪贴板工具
		paster: function(e){
			if (!currTextIsInSource.pasteBoardTool.isEnable()) {
				return true; //离开
			};
		    var clipboardData = e.originalEvent.clipboardData;
		    if (clipboardData) { //有趣:swfit就是可选值绑定了,哈!
		        var text = clipboardData.getData("Text");
		        if (text) {
					//检查是否是源码中
					if (!currTextIsInSource.isVaild()){
						return true; //返回有效
					}
					//手动对齐插入
					newText = toolBarTabTools.clearSource(text);
					if (newText != text && document.queryCommandSupported('insertText') && document.queryCommandSupported('delete')) {
			         	 $("#wpTextbox1").focus();
			             document.execCommand('insertText', false, newText);
			             //textarea.selectionStart = sel_start;
			             //textarea.selectionEnd = sel_start + newText.length;
			             return false;
					};
					//有效返回
					return true;
		        }
		    }
		},
		isLoaded: false,
		load: function(){ //载入
			$("#wpTextbox1").bind("paste", this.paster)
		},
		unload: function(){
			$("#wpTextbox1").unbind("paste", this.paster);
		},
		enable: function(en){
			if (en) {
				if (!this.isLoaded){
					this.load()
					this.isLoaded = true;
				}
			}else{
				if (this.isLoaded){
					this.unload()
					this.isLoaded = false;
				}
			}
		},
		isEnable: function(){ //返回是否开启
			var local_get_paster = localStorage.local_get_paster;
			return (local_get_paster && local_get_paster == "true");
		},
		loadBySaveConifg: function(){ //本次存储的载入
			this.enable(this.isEnable);
		},
		injectTool: function(){
			$('#source_auto a').after($('<input id="sourceAutoPaster" type="checkbox" value="1" title="自动修建剪贴板源码?">'));
			this.loadBySaveConifg();
			$('#sourceAutoPaster').prop("checked", this.isEnable())
			var toolThis = this
			$('#sourceAutoPaster').change(function(){
				var en = $(this).prop("checked");
				toolThis.enable(en);
				localStorage.local_get_paster = en;
				if (!en) {
					alert("本地源码粘贴自动修剪已经关闭!船长!")
				}else{
					alert("船长,本地源码自动修剪开启了!")
				}
			})
		}
	}
}

currTextIsInSource.pasteBoardTool.injectTool()

//源码外的小工具
//整理tab
var toolBarTabTools = {
	getSpace: function (str, useTab){
		if (typeof(useTab)=="undefined") useTab = false
		var len = 0;
		var match; //空格
		if (useTab){
			match = str.match(/^(\t+)/); //空格
		}else{
			match = str.match(/^( +)/); //空格
		}
		if (match) {
			len = match[0].length;
		} 
		return len;
	},
	getLessSpace: function getLessSpace(str, useTab){
		if (typeof(useTab) == "undefined") useTab = false
		var allLine = str.split(/[\r\n]/)
		var smallSpace = -1
		if (allLine.length > 0){
			for (i=0;i<allLine.length;i++){
				var line = allLine[i]
				var spaces = this.getSpace(line, useTab)
				if (smallSpace == -1){
					smallSpace = spaces
				}else if(spaces < smallSpace){
					smallSpace = spaces;
				}
			}
		}
		return smallSpace;
	},
	deleteSpaces: function (str, spaces, useTab){
		var allLine = str.split(/[\r\n]/)
		var spacesReg = new RegExp("^" + (useTab ? "\t":" ").repeat(spaces))
		if (allLine.length > 0){
			for (i=0;i<allLine.length;i++){
				allLine[i] = allLine[i].replace(spacesReg,"") //除掉空白
			}
			return allLine.join("\n")
		}
		return str //咋来就咋回去
	},
	//主入口
	clearSource: function (str){
		var less = this.getLessSpace(str, false)
		if (less > 1){
		    return this.deleteSpaces(str, less, false)
		}else{
		  less = this.getLessSpace(str, true)
          return this.deleteSpaces(str, less, true)
		}
	},
	replaceText: function(old, replace){ //替换编辑框,但愿不会用到.
	    var textarea = $("#wpTextbox1");
		var len = textarea.value.length;
		var sel_start = textarea.selectionStart;
		var end = textarea.selectionEnd;
		var sel = textarea.value.substring(start, end);		 
		textarea.value =  textarea.value.substring(0,start) + replace + textarea.value.substring(end,len);
	},
	doTheJob: function (source_Tag) {
		 if (typeof(source_Tag) == "undefined") source_Tag = "";
	     var sel = $("#wpTextbox1").textSelection("getSelection");
         var textarea = $("#wpTextbox1")[0];
	     if (!sel){
	         return;
	     }
		 var sel_start = textarea.selectionStart;
	     var newText = this.clearSource(sel)
	     if (source_Tag.length > 0){ //想法:或许不用比较也可以
	     	newText = "<source lang=\"" + source_Tag + "\">\n" + newText + '\n</source>'
	     }
	     if (sel != newText){
	         if (document.queryCommandSupported('insertText') && document.queryCommandSupported('delete')){
	         	 $("#wpTextbox1").focus();
	             document.execCommand('delete');
	             document.execCommand('insertText', false, newText);
	             //重新选择
	             //TODO: 内置函数如何
	             textarea.selectionStart = sel_start;
	             textarea.selectionEnd = sel_start + newText.length;
	         }//TODO: 旧版本替换
	     }
	}
}
