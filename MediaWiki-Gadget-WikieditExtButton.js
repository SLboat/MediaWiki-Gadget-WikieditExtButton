/* 这里是[[扩展:Gadget-WikieditExtButton]]的源码 */
//TODO: 全部放置到一致里面去!
/*global $, jQuery*/

/* 常规性变动的量 */

/* 名字空间分类
 * 使用名字的ID来作为索引
 * 在页面里使用wgNamespaceIds可以检索所有的 */

var namespace_for_kat = {
	666: "想法", //666-想法命名空间
	430: "短英语", //430-短英语命名空间
	432: "单词" //432-单词命名空间
};

/* 短写分类,意味着重写分类
 * 似乎这里和空格有点冲突了
 */
var short_for_kat = {
	"WR703": "WR703N", // WR703-特殊的家伙，特殊的被对待了哈哈
	"魔灯": "魔灯固件" //中文加上引号保险安全

};

/* 空格长分类替换模板
 * 这是特殊的带空格的高级分类们，如果是一样的那么就用[!]代替替换值
 * todo:或许self代替!?
 * todo:首字母大写,不该强制
 */
var space_within_kat = {
	"Amazon S3": "!", // 这个S3是个特殊的带空格
	"Amazon 云服务": "Amazon云服务", //啊哈，空格离开了
	"EOS 600D": "!", //600D咯
	"BLE STACK": "BLE-STACK", //那个BLE协议
	"AVR Studio": "AVR Studio", //avr的开发工具
	"APP Store": "!",
	"ITunes Connect": "!",
	"Mac Shell": "!", //shell
	"Mediawiki API": "!", //api啥的
	"Clozure CL": "!", //Lisp的免费好家伙!
	"IPhone 5C": "IPhone5C", //iPhone 5C的非空格写法
	"EBay 知识产权": "EBay知识产权", //合并空格
	"Sublime API": "!", //sublime的api哈
	"NRF51822 SDK": "!", //NRF51822处理
	"GCC ARM": "!", //GCC的ARM咯
	"XP": "Windows", //XP可不行哩,或许Windows XP
	"Arduino IDE": "!", //Arduino IDE咯
	"Apple TV 3": "!", //苹果电视
	"Core Animation": "!" //核心动画
};

//重写高亮类型,语法高亮嘛
var script_for_title = {
	//todo: 忽略大小写，封装到一个window的对象里进行记录，大小写需要忽略，看起来是/R还是啥子
	//描述原则：首字母要大写-当前的限制
	Js: "javascript", //对应的类型
	JQuery: "jquery", //jquery 有自己的方式
	Lua: "Lua",
	Vbs: "vb", //vbs
	VB: "vb", //VB咯
	Luarocks: "Lua", //也是lua家的
	Html: "html5",
	"Chrome扩展": "javascript",
	CSS: "CSS", //CSS咯
	CMD: "dos", //微软的老古董咯
	C: "c", //C咯
	VC: "c", //微软c
	VC6: "c", //微软的老C咯
	Php: "php", //苹果家的脚本
	MySQL: "mysql", //mysq也算一员好了
	AppleScript: "applescript", //苹果家的脚本
	Ruby: "ruby",
	Perl: "perl", //perl...梨子吗
	Python: "python", //大蟒蛇
	Arduino: "arduino", //arduino哩!
	Objc: "objc", //是的,原始的objc
	Foundation: "objc", //建造者框架
	IOS: "objc", //IOS开发可能用得上
	Swift: "swift" //会飞的燕子

}; //最后一个不要留下[,],否则chrome源码格式化总是容易失败的

/* 森亮号扩展按钮，目前可用测试方法，直接复制js到console里执行，所有依赖都存在 */
/* --第一部分--
 ** 增加界面按钮 **
 */
//1.1 清理图片按钮
var clean_pic_button = function() {
	//附加清理图片链接按钮
	$('<li><a id="btn_cleanpic" class="btn_byepic" title="清除所有图片链接">无链</a></li>')
		.appendTo($("div#p-cactions.vectorMenu .menu ul"));
	//注册事件
	$(".btn_byepic")
		.click(function() {
		// 去除所有图片链接
		$(".mw-body img").each(function(a, b) {
			$(b).parent().removeAttr("href");
		});
		// 隐藏编辑按钮
		$(".mw-editsection").hide();
		// 隐藏所有的Flickr链接按钮，即便不存在也没事
		$("#slboat_flickr_pics a").hide();
		// 删除目录的[隐藏]，有的话
		$(".toctoggle").text("");

	});
	//自动转换翻译按钮为默认翻译英文
	$(".mw-pt-translate-header [title]").attr("href", function(index, title) {
		return title.replace("zh-cn", "en");
	});
};

//1.2 短连接按钮
var shor_link_button = function() {
	var li_short = '<li><a id="btn_shortlink" class="btn_shortlink" title="显示短连接地址">短连</a></li>';
	if (mw.config.get('wgAction') != "view") return 1; //意外的话退出
	$(li_short).appendTo($("div#p-cactions.vectorMenu .menu ul"));
	$(".btn_shortlink")
		.click(function() {
		//重定向加上参数
		if (!window.location.toString().match(/[\?&]short/)) {
			window.location += "?short";
		};
	});
};

/* --第二部分--
 ** 增加编辑框按钮 **
 */
var customizeToolbar = function() { /* 这是第一个工具-翻译标记 */
	// $('#wpTextbox1').wikiEditor('addToToolbar', {
	// 	section: 'advanced',
	// 	group: 'format',
	// 	tools: {
	// 		buttonTranslate: {
	// 			label: '添加翻译标记',
	// 			type: 'button',
	// 			icon: '//see.sl088.com/w/images/8/8a/Google_translate.png',
	// 			action: {
	// 				type: 'encapsulate', //封装重新封装
	// 				options: { //传入参数
	// 					pre: "<translate>",
	// 					peri: "要翻译的内容放在这里",
	// 					post: "</translate>"
	// 				}
	// 			}
	// 		}
	// 	}
	// }); 
	$('#wpTextbox1').wikiEditor('addToToolbar', { /* 这里放入第二个工具-删除多余换行 */
		section: 'advanced',
		group: 'format',
		tools: {
			ButtonDelLine: {
				label: '处理掉重复换行',
				type: 'button',
				icon: '//see.sl088.com/w/images/8/8b/No_br_icon.png',
				action: {
					type: 'encapsulate', //封装重新封装
					options: { //传入参数
						'regex': /\n\n/g,
						'regexReplace': "\n",
					},
				},
			},
		},
	});
	$('#wpTextbox1').wikiEditor('addToToolbar', { /* 这里放入第三个工具-清理源码 */
		section: 'advanced',
		group: 'format',
		tools: {
			ButtonDelLine: {
				label: '清理源码Tab',
				type: 'button',
				icon: '//see.sl088.com/w/images/6/6c/TabIconToolBar.png',
				action: {
					type: 'callback', //封装重新封装
					execute: function(context){
						toolBarTabTools.doTheJob("");
					},
				},
			},
		},
	});	
};

/* --第三部分--
 ** 自动化插入工具栏 **
 */
//todo:或许可以更智能的生成按钮来插入呢？
//获得小标题
var get_small_title = function() {
	//自动分类和自动源码高亮都依赖于我的工作
	// 如果匹配最后一个空格会是怎样的？
	var match_patern = /([^[ ]+) .+/; //结尾啥子的
	var match_patern_subpage = /([^[\/]+)\/.+/; //子页面匹配
	var title = mw.config.get('wgTitle'); // RL(资源调用器)的API，不需要页面的
	var title_small = title.match(match_patern); // 不匹配会是null
	if (!title_small) {
		title_small = title.match(match_patern_subpage); //试试子页面的运气
	};
	if (title_small != null && title_small[1].length < 50) {
		return title_small[1]; //有效咯，返回咯
	};
	return "";
};

//todo:增加返回
var auto_kat = function(kat) {
	// 获取原生标题
	var full_title = mw.config.get('wgTitle');
	//检查[:]命名空间的匹配必要
	if (namespace_for_kat[mw.config.get('wgNamespaceNumber')]) {
		//理论上这里可以改写位 kat = new || kat..
		kat = namespace_for_kat[mw.config.get('wgNamespaceNumber')];
	};
	// 检查是否匹配空格需要
	if (full_title.match(/ /)) {
		for (do_i_match in space_within_kat) {
			if (full_title.search(do_i_match) == 0) { //开头匹配标题了
				kat = (space_within_kat[do_i_match] == "!") ? do_i_match : space_within_kat[do_i_match];
				break;
			};
		};
	};
	if (kat.length == 0) {
		return false; //直接返回去
	};
	// 意味着可能被重写
	if (short_for_kat[kat]) //拥有备记的话，愿null和undefined好运，这里有半个前提声明呢
	{
		kat = short_for_kat[kat]; //重写咯
	};

	// 最后才渲染的选择框，这有点麻烦
	//if ($("#mw-edittools-charinsert select").val() == 0) {
	// 自动分类
	var kat_html = $("#char_show_auto").html().replace(/\[\[分\类:自动\]\]/g, "[[分\类:" + kat + "]]"); //自动分类
	$("#char_show_auto").html(kat_html); //写入分类-管它呢
	$("#char_show_auto").show(); //显示出来
	insertKat4Empty(kat); //自动引入分类
	return true;
	//} //这里取消
};

//自动放入默认的空白页一个分类
var insertKat4Empty = function(kat) {
    var wpEditBox = $("#wpTextbox1")
    var hadText = function() {
        return (wpEditBox.val().length > 1) 
    }
 	if (document.location.search.search("&section=new") > 0){
 		return; //存在段落
 	}
    if (hadText()) {
        return;
        //不必要执行
    }
    var api = new mw.Api();
    api.get({
        srsearch: kat,
        action: 'query',
        list: 'search',
        srwhat: 'title',
        srnamespace: '14'
    })
    .done(function(data) {
        if (hadText()) {
            return
        }
        var result = data.query.search
        if (result.length > 0) {
            var st = result[0].title
            if (st == "分类:" + kat) {
                //输入文字
                var brstr = "\n\n"
                wpEditBox.focus()
                document.execCommand('insertText', false, brstr + "[[分类:" + kat + "]]");
                wpEditBox[0].selectionStart = 0
                wpEditBox[0].selectionEnd = 0
            }
        }
    })
    .fail(function(error) { //链坠,哈哈!
        console.log('船长: 自动分类-检验分类失败了: ', error);
    });
}

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
		if (less > 0){
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
			 var sel_start = textarea.selectionStart;
	     var newText = this.clearSource(sel)
	     if (source_Tag.length > 0){ //想法:或许不用比较也可以
	      var tagFirstPart = "<source lang=\"" + source_Tag + "\">\n"; //源码第一部分 
       	newText = tagFirstPart + newText + '\n</source>'
	     }
	     if (self == newText) retrun; //无活可干
	     //进行插入
       if (document.queryCommandSupported('insertText') && document.queryCommandSupported('delete')){
       	 $("#wpTextbox1").focus();
       	 	if (sel) document.execCommand('delete');
          document.execCommand('insertText', false, newText);
           //重新选择
           //TODO: 内置函数如何
           if (sel){
           		textarea.selectionStart = sel_start;
           		textarea.selectionEnd = sel_start + newText.length;
       	 		} else if (source_Tag.length > 0) { //源码放置
       	 			var tagPos = sel_start + tagFirstPart.length;
       	 			textarea.selectionStart = tagPos; //新的长度
       	 			textarea.selectionEnd = tagPos;
       	 		}
       }//TODO: 旧版本替换
	}
}

//剪贴板源码处理
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

//本地的源码处理
var local_script = {
	fit: function() { //填充到本地
		var local_get_script = localStorage.slboat_scripttype;
		if (local_get_script && local_get_script.length < 30) {
			$("#source_local a").text("本地源码:" + local_get_script);
			$("#source_local a").attr("href","javascript:void(0)"); //动作化它
			$("#source_local a").removeAttr("onclick"); //删除掉
			$("#source_local a").unbind("click");
			$("#source_local a").click(function(){
				toolBarTabTools.doTheJob(local_get_script);
				//console.log("船长,清理了代码!")
			})
			//$("#source_local a").attr("onclick", "toolBarTabTools.doTheJob();insertTags('<source lang=\"" + local_get_script + "\">\\n','\\n</source>','');return false")
			$("#source_local").show(); //显示标签
		} else {
			//$("#source_local").hide(); //显示标签
		}
	},
	set: function() { //本地进行设置
		var get_local = prompt("船长!你想将快速的语言换为啥", localStorage.slboat_scripttype);
		if (get_local) {
			localStorage.slboat_scripttype = get_local;
			local_script.fit(); //重新填充
		};
	},
};


/* 自动处理源码 */
var auto_source = function(title) {
	//所有的简写方式在头部声明
	var auto_script_type = script_for_title[title]; //临时的类型
	if (typeof(auto_script_type) == "undefined") auto_script_type = "bash" //默认类型
	/* 自动的宏替换按钮的名称 */
	$(".auto-for-name").each(function() {
		var $edit_but = $(this); //这次的按钮
		var title_get = $edit_but.prop("title");
		if (title_get) {
			$edit_but.find("a").text(title_get); //替换掉标题
		};
	})
	/* 默认自动源码名称 */
	$("#source_auto a").attr("href","javascript:void(0)"); //动作化它
	$("#source_auto a").removeAttr("onclick"); //删除掉
	$("#source_auto a").click(function(){
		toolBarTabTools.doTheJob(auto_script_type);
		//console.log("船长,清理了代码!")
	})
	/* 遗弃的旧代码 */
	/* 源码的玩意都注入换行符号 */
	//$("#source_auto a").attr("onclick", $("#source_auto a").attr("onclick").replace(/(>)(',')(<\/source)/, "$1\\n$2\\n$3")); //假如换行的力量
	// $("#source_auto").html(function(index, html) {
	// 	return html.replace(/bash/, auto_script_type);
	// }); //替换按钮事件

	$("#source_auto a").text("自动源码:" + auto_script_type)
	local_script.fit(); //填充进去
	$("#local_source_change").click(local_script.set);
};

//音频见识
var audio_button = function() {
	//临时小玩意-未来或许不再，这里是自动音频见识的玩意
	//看看是不是有音频见识标签
	if ($("#audio_come a").length > 0) {
		//替换它的属性
		$("#audio_come a").removeAttr("onclick"); //解除所有默认绑定
		$("#audio_come a").click(function() {
			var mp3_file = ""; //空赋值
			var get_a_kat = ""; //获得一个分类
			if ($(".file-title").first().text().length > 0) {
				//如果有文件的标题
				mp3_file = "<!-- 以下是自动插入的音频见识文件 -->";
				//一点注释
				mp3_file += "\n:\[\[File:" + $(".file-title").first().text() + "]]\n"; //获得了一个mp3文件名
			};
			//如果不能自动分类的页面
			if (get_small_title().length == 0) {
				get_a_kat = "\n[[分\类:想法]]\n";
			};
			insertTags("==音频想法==\n----\n" + mp3_file + "\n* ", "\n* \n\n" + get_a_kat, "");
		});
		$("#audio_come").show(); //显示整个span
	};
};

var patch_edittool = function() { //补丁编辑工具
	var small_title = get_small_title();
	//干活开始
	auto_source(small_title);
	/* 自动源码粘贴 */
	currTextIsInSource.pasteBoardTool.injectTool()
	/* 关闭音频见识 */
	//audio_button(); //音频见识增加
};

/* 聚焦编辑框作为热点 */
var focus_editor = function() {
	//聚集编辑框
	$('#wpTextbox1').focus();
}

/* 开始注入小工具们，或许该等页面载入完？ */
/* 当在编辑模式，有可用的组件，支持新的工具栏就开启 */
//submit是干嘛的?
//TODO:mw.Api可能依然还没有加载呢...
if ($.inArray(mw.config.get('wgAction'), ['edit', 'submit']) !== -1) {

	/* 开始执行咯 */
	$(function() {
		mw.loader.using("mediawiki.api",function(){
			auto_kat(get_small_title());
		});
	});

	mw.loader.using('user.options', function() {
		if (mw.user.options.get('usebetatoolbar')) {
			mw.loader.using('ext.wikiEditor.toolbar', function() { /* 自定义按钮-新的方式，仅仅V1.21支持的方式，需要一些trick */
				$('#wpTextbox1').on('wikiEditor-toolbar-doneInitialSections', customizeToolbar); /* 自定义按钮-旧的方式，会造成按钮重叠，暂废弃 */
				//$(document).ready(customizeToolbar);
				$(function() { /* 移动预览的东西到编辑按钮下面去 */
					$(".mw-summary").insertBefore($(".editButtons")); /* 执行补丁工具 */
					patch_edittool(); //编辑工具打包-自动分类啥的
					focus_editor(); //编辑框聚焦
				});
			});
		}
	});
};

/* 初始化的玩意 */
$(function() {
	if (mw.config.get('wgAction') == "view") {
		//增加清除按钮
		clean_pic_button();
		//短连接按钮
		shor_link_button();
	};
});

/* 这里是剪贴板替换的玩意 */
var bind_paste_hook = function() {
	var debug_print = true; //输出操作信息
	/* 收到了剪贴板文本 */
	var onPasteText = function(e) {
		var clipboardData = e.originalEvent.clipboardData;
		if (clipboardData) {
			var data = clipboardData.getData("Text");
			if (data) {
				//console.log("发现了粘贴的内容:", data);
				if (slboat_paste_str_take(data)) {
					return false; //已经处理了,抛弃
				};
			};
		};
	};

	/* 子函数:匹配是否有效的参考名称 */
	var match_right_refname_place = function(text) {
		var full_match_patern = /^(<ref name=\"seeing_[0-9]{6}_[0-9]{6}\">)$/;
		var all_line_match_patern = /^\s*===.+<sup>.+(<ref name=\"seeing_[0-9]{6}_[0-9]{6}\">).+<\/ref>===\s*$/;
		var just_part_match_patern = /(.*)(<ref name=\"seeing_[0-9]{6}_[0-9]{6}\">)(.*)/; //有趣*是或者没,+是必须有,?是0或许1次

		var left_match_text = '<sup> 沿途见识</sup>'; //左边匹配的文字

		if (text.match(full_match_patern)) { //检查完全匹配-头尾一致
			return text.match(full_match_patern)[1];
		} else if (text.match(all_line_match_patern)) { //匹配了有开头和结尾的一整句
			return text.match(all_line_match_patern)[1];
		} else if (text.match(just_part_match_patern)) { //只有一部分匹配了
			all_matchs = text.match(just_part_match_patern);
			var PASS_CHECK_FLAG = false; //检查失败
			if (all_matchs[1].length < 17 && all_matchs[3].length < 5) { //如果两头不太长
				//检查第一部分是否匹配
				if (all_matchs[1].length > 0) {
					if (all_matchs[1] != left_match_text.slice(0 - all_matchs[1].length)) {
						PASS_CHECK_FLAG = false; //不匹配左边
					};
				};
				//检查右边是否带有([) ?
				if (all_matchs[3].length > 0) {
					if (all_matchs[3].slice(0, 1) != "[") {
						PASS_CHECK_FLAG = false; //右边不符合规则
					};
				};

			};
			//最后的机会,检查是否已经存在
			if (!PASS_CHECK_FLAG) {
				if ($('#wpTextbox1').val().indexOf(text) > -1) {
					PASS_CHECK_FLAG = true; //一切复活了
				};
			};
			//如果一切都好
			if (PASS_CHECK_FLAG) {
				return all_matchs[2]; //看起来没啥问题
			}; //结束长度等的种种..
		};
		//啊啊,不匹配
		return null;
	};

	/* 处理剪贴板内容,如果必要的话,替换了的话返回true
	 * 如果啥也没有做,返回false
	 */
	var slboat_paste_str_take = function(text) {
		text = $.trim(text); //切掉空格
		/* 开始处理,匹配所有需要替换的宏们 */
		if (match_right_refname_place(text)) { //匹配参考标记
			if (debug_print) console.log("钩子事件:", "替换了航海见识的引用标记");
			replace_text = match_right_refname_place(text); //划分处理句法
			replace_text = replace_text.replace(">", "/>"); //注入参考标记
			//美化和包装...
			replace_text = ("{{int:见识}}" + replace_text).sup();
			insertTags("", "", replace_text); //输入替换的内容,但是已选中的状态
			return true;
		};

		//oops,坏事情发生了
		return false;
	};

	//进行最终函数的绑定
	$("#wpTextbox1").bind("paste", onPasteText);
};

/* 绑定剪贴板事件 */
$(function() {
	if (mw.config.get('wgAction') == "edit") {
		//粘贴事件钩子
		bind_paste_hook();
	};
});

/* 航海见识扩展按钮 
 * 森亮号删除页显示链入页
 * 这里是一个完整单独的模块
 * 最初完成于 2013-11-23 晚0点
 */
var slboat_links_in_delmove = {

	/* 注入提示文字 */
	inject: function() {
		//防止重复注入
		if ($("#mainpage_linkin").length == 0) {
			var $intoDiv = $("#deleteconfirm, #movepage"); //放入的地方,另一个选择是它的.parent()
			//注入主页面链接
			$intoDiv.after('<h2 style="color: red;">主页面链入页面</h2><div id="mainpage_linkin">船长!我来了!立即开始!正在探索链入页面....</div>');
			//注入子页面链接-同样前推
			$intoDiv.after('<h2 style="color: darkorange;">子页面链入页面</h2><div id="childs_links" style="color: darkorange;"><div id="blank_childs" style="color: grey;">船长..我在找寻子页面!</div></div>');
			//这里有个空标记→$("#blank_childs"),删除它..在实际的存在后
			return true;
		};
		return false;
	},

	/* 写入主页面提示内容 */
	log: function(html) {
		$("#mainpage_linkin").html(html);
	},
	leaveBlank: function() {
		//[校验]检查是否存在hr
		if ($("#childs_links hr").length == 0) {
			//[动作]如果无-那么放入hr
			$("#childs_links").append($("<hr style='width: 100px;'>"));
		}
	},
	/* 写入子页面提示内容 */
	logchild: function(html, flagDoesEmpty) {
		var flagDoesEmpty = flagDoesEmpty || false;
		//清理默认提醒
		if ($("#blank_childs").length > 0) {
			$("#blank_childs").remove();
		}
		if (flagDoesEmpty) { //[标记]这里是空的话
			//[横线]建造空的
			this.leaveBlank();
			//注入新的提醒一个
			$("#childs_links").append($("<span style='color: grey;''>" + html + " </span>"));
		} else {
			$("#childs_links").prepend($("<div>" + html + "</div>"));
		}
	},
	/* 开始工作 */
	start: function() {
		if (mw.config.get('wgAction') != "delete" && mw.config.get('wgCanonicalSpecialPageName') != "Movepage") { //非删除页面,罢工
			return false;
		};
		if ($("#deleteconfirm, #movepage").length == 0) { //没有删除框啥的,罢工
			console.log("船长,非常诡异,这是个异常的页面...");
			return false;
		};
		//注入框
		this.inject();
		/* 检查模板页,罢工 */
		if (mw.config.get('wgNamespaceNumber') == 10) {
			slboat_links_in_delmove.log("船长!该死的!这个是模板页面,老子无法探查!");
			$("#mainpage_linkin").css("color", "red"); //红色提醒
			return false;
		};
		//开始检查-穷举的检查
		this.list();
		//完成咯!
		return true;
	},
	/* 列出来子页面 */
	list: function() {
		var api = new mw.Api();
		var masterThis = this; //把this赋给机器
		api.get({
			action: 'query',
			list: 'prefixsearch',
			pssearch: mw.config.get("wgRelevantPageName")
			//下一行不能注释,否则会格式化有误(jsFormat)
		})
			.done(function(data) { //[发生]获得了有效数据,[有趣]这里的链坠它是怎么解开的呢?毕竟都是object嘛
				var havaChildPages = false; //[变量]是否拥有子页面
				prefix_title_array = data.query.prefixsearch;
				if (prefix_title_array.length > 0) {
					for (title_obj in prefix_title_array) {
						clildTitle = prefix_title_array[title_obj].title; //字标题!
						//[过滤]对于只是前面相同的子页面我们需要过滤它,考虑到[ ]和[_]长度一致,故我们判定长度
						if (clildTitle.length == mw.config.get("wgRelevantPageName").length) {
							masterThis.check(clildTitle);
						} else if (clildTitle.match("/")) { //[判定]纯粹的子页面
							masterThis.check(clildTitle);
							havaChildPages = true; //无论如何是真的了
						}
					};
					//[路标]这里结束了穷举,但是是异步的送入
					if (!havaChildPages) {
						masterThis.logchild("船长!子页面都不存在!");
					}
				};

			})
			.fail(function(error) { //失败的时候
				console.log('API failed :(', error);
			});
	}, //结束list
	/* 只是检查 */
	check: function(title) {
		// [风格]titleForCheck→像那种objc里的嘛!但没有用在这里,我们要简化!
		// [里程碑]依旧里程碑,也能够mw.API代替了$.ajax
		// [思索]这里不需要传入太多的东西,不需要,它可以自己判别...
		var api = new mw.Api();
		var masterThis = this; //把this赋给机器
		//最好都传入了..最好
		var checkTitle = title || mw.config.get("wgRelevantPageName");

		//[想法],如果是个object的对象自然更好..但是先不理,最简单的搭建一个
		//[下划线]由于可能自动出现这个东西,所以替换回来空格是好的
		var isPageSelf = (title == mw.config.get("wgRelevantPageName").replace(/_/g, " ")); //取得是否是页面自己

		api.get({
			action: 'query',
			list: 'backlinks',
			bltitle: checkTitle
		})
			.done(function(data) {
				//成功的话的返回,paser的json格式
				/* 递归检查结果是否一致 */
				if (data && data.query && data.query.backlinks) {
					//TODO:这里需要开始检查是否主页面
					//TODO:同时的这里需要一次性合成输出,而不是等待着...
					var all_backlinks = data.query.backlinks; //所有的链入
					if (all_backlinks.length == 0) {
						if (isPageSelf) {
							masterThis.log("[[" + checkTitle + "]]无有链入!");
						} else {
							//NEXT:完成子页面...
							masterThis.logchild("[[" + checkTitle + "]]独存!", true);
						}
						return false; //再见
					};

					Final_Text = "[[" + checkTitle + "]]的" + data.query.backlinks.length + "个链入见识:\t"; //最终显示

					for (var index in all_backlinks) {
						var linkTitle = all_backlinks[index].title;
						Final_Text += "<a class='a_link_in' target='_blank'' href='/wiki/" + linkTitle + "?&action=edit'>[[" + linkTitle + "]]</a>";
					};

					if (isPageSelf) {
						masterThis.log(Final_Text);
						$("#mainpage_linkin").css("color", "red"); //红色提醒
					} else
					//TODO:有的插入前面,没有的插入后面
						masterThis.logchild(Final_Text);
				}
			})
			.fail(function(error) {
				masterThis.log('错误: API返回错误: "' + error.code + '": ' + error.info);
			});
	},
};

/* 开始执行咯 */
$(function() {
	mw.loader.using("mediawiki.api",function(){
		slboat_links_in_delmove.start();
	});
});