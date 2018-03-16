/**
 * base js file
 * 
 * date: 2017-5-29
 */

$(function() {
	var contextPath = $('.contextPath').val();
	// for mobile
	$(window).resize(function() {
		forMobile();
	});
	forMobile();
	function forMobile() {
		if ($('body').width() <= 414) {
			$('.news').css('display', 'none');
			$('.carousel').addClass('mobileBanner');
			$('.toTop').css('display', 'none');
			$('.toBottom').css('display', 'none');
			$('.secnav').remove();
			$('.fastSearch').css('display', 'none');
			$('#msgAction').css('top', '8px');
		} else {
			$('#msgAction').css('top', '-8px');
			$('.news').css('display', 'block');
			$('.carousel').removeClass('mobileBanner');
			$('.fastSearch').css('display', 'block');
		}
	}
	// videos list
	$.getJSON(contextPath + "/data/videos", function(data) {
		var html = '';
		$(data.videoList).each(
				function(i) {
					var vName = data.videoList[i].vname;
					var vUrl = contextPath + '/' + data.videoList[i].vurl;
					var videoHtml = '<li class="video' + (i + 1)
							+ '"><a href="' + vUrl + '"> ' + vName
							+ '</a></li>';
					html += videoHtml;
				});
		$('#videoList').html(html);
	});
	// load msg
	var msgs = null;
	var msgSize = 0;
	$.getJSON(contextPath + "/data/messages",function(data) {
	   msgs = data.msgList;
	   msgSize = msgs.length;
	});
	var part = 1;
	var count = 3;
	$('.moreBtn').click(function() {
		    if(count < msgSize){
		    	part++;
		    	pre_count = count;
		    	$(msgs).each(function(index) {
					if (index > count -1 && index < part * 3) {
						    count++;
						    if(count == msgSize)
						    	$('.moreMsg').html('亲，没有更多了');
							var liId = 'msg'+ (index + 1);
							var msgHtml = '<li id="'+ liId+ '">'+ $('.msgContainer > li').eq(0).html()+ '</li>';
							$('.msgContainer').append(msgHtml);
							var msg = $('#'+ liId);
							var mname = this.mname;
							var mcontent = this.mcontent;
							var mtime = new Date(this.mtime).format();
							var replys = this.replys;
					 		msg.find('.msgID').val(this.mid);
							msg.find('.msgUserName').html(mname+ '&nbsp;'+ mtime);
							msg.find('.msgBox p').html(mcontent);
							var replyHtml = msg.find('.returnList > li').eq(0);
							msg.find('.returnList').html('');
							$(replys).each(function() {
										if (this.rname) {
											msg.find('.returnList').append(replyHtml);
											msg.find('.returnMsg h5').html(this.rname+ '&nbsp;'+ new Date(this.rtime).format());
											msg.find('.returnMsg p').html(this.rcontent);
										}
									});
					} 
				 });
		    	registerEventForReply(pre_count,count);
		    }
	 });	
	
	// blog list
	$.getJSON(contextPath + "/data/topTen", function(data) {
		var html = '';
		$(data.blogs).each(
				function(i) {
					var bID = data.blogs[i].bid;
					var bCount = data.blogs[i].bcount;
					var bTitle = data.blogs[i].btitle;
					var bUrl = contextPath + "/main/article?bid=" + bID
							+ "&bcount=" + bCount + "&btitle=Top" + (i+1);
					var blogHtml = '';
					blogHtml = i < 3 ? '<li><span style="color: #ED1B24;" class="glyphicon glyphicon-thumbs-up"> '
							+ '</span>&nbsp;<a href="' + bUrl + '"> '
							+ bTitle + '(' + bCount + ')</a></li>'
							: '<li><span style="color: #26CAE3;" class="glyphicon glyphicon-tags"> '
									+ '</span>&nbsp;<a href="' + bUrl
									+ '"> ' + bTitle + '(' + bCount
									+ ')</a></li>';
					html += blogHtml;
				});
		$('#blogList').html(html);
	});
	// notice
	$("#noticeList").children().each(function(i) {
		$(this).css("top", 22 * (i - 1) + "px");
	});
	function moveNotice() {
		var noticeSize = $("#noticeList").children().length;
		$("#noticeList").children().each(function(i) {
			if ($(this).css("top") == "-44px") {
				$(this).css("top", (noticeSize - 2) * 22 + "px");
			}
			var currDis = parseInt($(this).css("top")) - 22 + "px";
			$(this).animate({
				top : currDis
			}, "slow");

		});
	}
	setInterval(moveNotice, 3000);
	// login
	$('#loginBtn').click(
			function() {
				$('.nameNull').css('display', 'none');
				$('.psdNull').css('display', 'none');
				$('.codeNull').css('display', 'none');
				var name = $('#login input[name=username]').val();
				var psd = $('#login input[name=password]').val();
				var code = $('#login input[name=validCode]').val();
				name == '' ? $('.nameNull').css('display', 'block')
						: psd == '' ? $('.psdNull').css('display', 'block')
								: code == '' ? $('.codeNull').css('display',
										'block') : checkLogin(name, psd, code);

			});
	function checkLogin(name, psd, code) {	
	$
				.ajax({
					type : "POST",
					url : contextPath + "/data/loginError",
					data : "name=" + name + "&psd=" + psd + "&code=" + code,
					dataType : "json",
					success : function(data) {
						data.nameError ? $('.nameNull').text(data.nameError)
								.css('display', 'block')
								: data.passwordError ? $('.psdNull').text(
										data.passwordError).css('display',
										'block')
										: data.codeError ? codeErrorARefreshCode(data.codeError)
												: loginAndClose();

					},
					error : function() {
						alert('GET DATA ERROR!');
					}
				});
	}
	function codeErrorARefreshCode(error) {
		$('.codeNull').text(error).css('display', 'block');
		$('#codeImage').attr('src',
				contextPath + '/user/validcode?id=' + Math.random());
	}
	function loginAndClose() {
		$('#loginForm').submit();
		$('#login').slideUp("slow", function() {
			$('.lk').removeClass('lock');
			$(document.body).css({ // 开启滚动条
				"overflow-x" : "visible",
				"overflow-y" : "visible"
			});
			$('#codeImage').attr('src', '');
		});
	}

	// search nav
	$(document).scroll(function() {
		var scrollTop = $(this).scrollTop();
		if (scrollTop >= 115) {
			$('.navbar-inverse').css("top", "0px").fadeIn("slow");
		} else {
			$('.navbar-inverse').fadeOut("10");
		}
	});
	// lock
	$('.loginButton').click(function() {
		if ($('.popup-content').css('display') == 'block')
			$('.popup-content').css('display', 'none');
		$('.lk').addClass('lock');
		$('#login').slideDown();
	});
	$('.closeLogin').click(
			function() {
				$('#codeImage').attr('src',
						contextPath + '/user/validcode?id=' + Math.random());
				$('#login').slideUp("slow", function() {
					$('.lk').removeClass('lock');
				});
			});
	// register
	var userNameSuccess = false;
	var passwordSuccess = false;
	var passwordTwiceSuccess = false;
	$('.registerButton').click(function() {
		if ($('.popup-content').css('display') == 'block')
			$('.popup-content').css('display', 'none');
		$('.lk').addClass('lock');
		$('.reg').slideDown();
	});
	$('#closeReg').click(function() {
		$('.reg').slideUp("slow", function() {
			$('.lk').removeClass('lock');
		});
	});
	$('.reg input[name=username]').focus(function() {
		$('#userCheck').show();
		$('#userError').hide();
		$('#userSuccess').hide();
	}).blur(function() {
		if ($.trim($(this).val()) == '') {
			$('#userCheck').hide();
			$('#userError').hide();
			$('#userSuccess').hide();
			userNameSuccess = false;
		} else if (!/^(.{2,12})$/.test($.trim($(this).val()))) {
			$('#userCheck').hide();
			$('#userError').show();
			$('#userSuccess').hide();
			userNameSuccess = false;
		} else {
			$('#userCheck').hide();
			$('#userError').hide();
			$('#userSuccess').show();
			userNameSuccess = true;
		}
	});
	$('.reg input[name=password]').focus(function() {
		$('#passwordCheck').show();
		$('#passwordError').hide();
		$('#passwordSuccess').hide();
	}).keyup(function() {
		check_pass(this);
	}).blur(function() {
		if (check_pass(this)) {
			$('#passwordCheck').hide();
			$('#passwordError').hide();
			$('#passwordSuccess').show();
			passwordSuccess = true;
		} else {
			$('#passwordCheck').hide();
			$('#passwordError').show();
			$('#passwordSuccess').hide();
			passwordSuccess = false;
		}
	});
	$('.reg input[name=passwordTwice]').blur(function() {
		if ($('.reg input[name=password]').val() == $(this).val()) {
			$('#passwordTwiceSuccess').show();
			$('#passwordTwiceError').hide();
			passwordTwiceSuccess = true;
		} else {
			$('#passwordTwiceSuccess').hide();
			$('#passwordTwiceError').show();
			passwordTwiceSuccess = false;
		}
		if (userNameSuccess && passwordSuccess && passwordTwiceSuccess) {
			$('#reg_submit').removeAttr('disabled');
		}
	});
	function check_pass(_this) {
		var value = $.trim($(_this).val());
		var value_length = value.length;
		var code_type = 0;
		var flag = false; // if the password is standard

		// condition 1
		if (value_length >= 6 && value_length <= 20) {
			$('#passwordCheck .q1').html('●').css('color', '#5CB85C');
		} else {
			$('#passwordCheck .q1').html('○').css('color', '#ccc');
		}
		// condition 2
		if (value_length > 0 && !/\s/.test(value)) {
			$('#passwordCheck .q2').html('●').css('color', '#5CB85C');
		} else {
			$('#passwordCheck .q2').html('○').css('color', '#ccc');
		}
		// condition 3 must be satisfied
		if (/[0-9]/.test(value)) {
			code_type++;
		}
		if (/[a-z]/.test(value)) {
			code_type++;
		}
		if (/[A-Z]/.test(value)) {
			code_type++;
		}
		if (/[^0-9A-Za-z]/.test(value)) {
			code_type++;
		}
		if (code_type > 2) {
			$('#passwordCheck .q3').html('●').css('color', 'green');
		} else {
			$('#passwordCheck .q3').html('○').css('color', '#666');
		}

		// the password was be divided into 3 levels
		if (value_length >= 10 && code_type >= 3) {
			$('#passwordCheck  .s').css('color', 'green');
			$('#passwordCheck  .s4').html('高').css('color', 'green');
		} else if (value_length >= 8 && code_type >= 2) {
			$('#passwordCheck  .s').css('color', '#f60');
			$('#passwordCheck  .s3').css('color', '#ccc');
			$('#passwordCheck  .s4').html('中').css('color', '#f60');

		} else if (value_length >= 1) {
			$('#passwordCheck  .s').css('color', '#ccc');
			$('#passwordCheck  .s1').css('color', 'maroon');
			$('#passwordCheck  .s4').html('低').css('color', 'maroon');
		} else {
			$('#passwordCheck  .s').css('color', '#ccc');
			$('#passwordCheck  .s4').html('');
		}
		if (value_length >= 6 && value_length <= 20 && !/\s/.test(value)
				&& code_type >= 2)
			flag = true;
		return flag;
	}

	// email
	$.domains = new Array();
	$.isDomain = true;
	$('#email').keyup(function() {
		$('.emails').slideDown();
		var input = $(this).val();
		var usrname = input.split('@')[0];
		$('.emails li').each(function(i) {
			if ($.isDomain) {
				$.domains[i] = $(this).html();
				if (i == 5)
					$.isDomain = false;
			}
			$(this).html(usrname + $.domains[i]);
			$(this).click(function() {
				$('#email').val($(this).html());
				$('.emails').slideUp();
			});
		});
	}).blur(function() {
		$('.emails').slideUp();
	});
	// valid code
	$('#codeImage').click(
			function() {
				$(this).attr('src',
						contextPath + '/user/validcode?id=' + Math.random());
			});
	// return msg
	registerEventForReply(0,2);
	function registerEventForReply(begin,end){
		$('.msgContainer > li')
		.each(function(index) {
			if(index >= begin && index <= end){
				var that = this;
				// reply msg btn event
				$(this).find('.msgContent').hover(function(){
					$(this).find('.returnBtn').animate({
						right: '0px'
					},500);
				},function(){
					$(this).find('.returnBtn').animate({
						right: '-80px'
					},500);
				});
				$(this).find('.msgContent p').hover(function(){return false;});
				$(this).find('.returnBtn').hover(function(){return false;});
				
				$(this).find('.face-btn').click(
					function() {
						$(that).find('.returnFaces').toggle(
								$(that).find('.returnFaces').css(
										'display') == 'none');
					});
				$(this).find('.returnFaces li').click(
						function() {
							$(that).find('.returnContent').html(
									$(that).find('.returnContent')
											.html()
											+ $(this).html());
						});
				$(this).find('.returnBtn').click(
						function() {
							var returnForm = $(that)
									.find('.returnForm');
							if (returnForm.css('display') == 'none') {
								returnForm.slideDown();
								$(this).text('取消回复');
							} else {
								$(this).text('回复');
								returnForm.find('.returnContent').html(
										'');
								$('.returnError')
										.css('display', 'none');
								returnForm.slideUp();
								$(that).find('.returnFaces').css(
										'display', 'none');
							}
						});
				$(this)
						.find('#returnSubmit')
						.click(
							function() {
							var returnForm = $(that).find(
									'.returnForm');
							var msgID = $(that).find('.msgID')
									.val();
							if ($.trim(returnForm.find(
									'.returnContent').text()) == '') {
								returnForm
										.find('.returnError')
										.text('亲，回复内容不能为空')
										.css('display', 'block');
							} else if ($('.userName').text() == '') {
								$('.lk').addClass('lock');
								$('.popup-content').css(
										'display', 'block');
							} else {
								var returnBtn = $(that).find(
										'.returnBtn');
								returnForm.find('.returnError')
										.css('display', 'none');
								var returnContent = returnForm
										.find('.returnContent')
										.html();
								var returnName = $(
										'.returnName').html();
								var returnTime = new Date()
										.format();
								var html1 = '<li><div class="returnMsg"><h5>';
								var html2 = '</h5><p style="margin: 20px 10px;">';
								var html3 = '</p></div></li>';
								$.ajax({
									url : contextPath
											+ "/main/reply",
									method : 'POST',
									async : 'true',
									data : 'mid='
											+ msgID
											+ '&rname='
											+ returnName
											+ '&rcontent='
											+ returnContent
											+ '&rtime='
											+ returnTime,
									success : function(
											msg) {
										var error = msg
												.split('|')[1];
										if (error) {
											returnForm
													.find(
															'.returnError')
													.text(
															error)
													.css(
															'display',
															'block');
											return;
										}
										$(that)
												.find(
														'.returnList')
												.append(
														html1
																+ returnName
																+ '&nbsp;'
																+ new Date()
																		.format()
																+ html2
																+ returnContent
																+ html3);
										returnForm
												.slideUp();
										returnBtn
												.text('回复');
										returnForm
												.find(
														'.returnContent')
												.html(
														'');
										$(
												'.returnError')
												.css(
														'display',
														'none');
										returnForm
												.slideUp();
										$(that)
												.find(
														'.returnFaces')
												.css(
														'display',
														'none');

									},
									error : function() {
										returnForm
												.find(
														'.returnError')
												.text(
														'抱歉出错了，暂时无法留言')
												.css(
														'display',
														'block');
									}
								});
												}
							});
			}
        });
	}
	
	// diliver msg
	$('.closePop').click(function() {
		$('.popup-content').css('display', 'none');
		$('.lk').removeClass('lock');
	});
	$('#faces li').click(function() {
		$('.mContent').html($('.mContent').html() + $(this).html());
	});
	$('#face-btn').click(function() {
		$('#faces').toggle($('#faces').css('display') == 'none');
	});
	$('#msgAction').click(showMsgForm);
	$('#msgSubmit').click(checkAndPublish);
	function showMsgForm() {
		if ($('.msgForm').css('display') == 'none') {
			$('.msgForm').slideDown();
			$('#msgAction .slideSpan').removeClass('glyphicon-menu-down')
					.addClass('glyphicon-menu-up');
		} else {
			if ($('#faces').css('display') != 'none')
				$('#faces').slideUp();
			$('.mContent').html('');
			$('.msgError').css('display', 'none');
			$('.msgForm').slideUp();
			$('#msgAction .slideSpan').removeClass('glyphicon-menu-up')
					.addClass('glyphicon-menu-down');
		}
	}
	function checkAndPublish() {
		if ($.trim($('.mContent').text()) == '') {
			$('.msgError').text('亲，您输入了空内容').css('display', 'block');
		} else if ($('.userName').text() == '') {
			$('.lk').addClass('lock');
			$('.popup-content').css('display', 'block');
		} else {
			$('.msgError').css('display', 'none');
			var mID = 1;
			var mContent = $('.mContent').html();
			var mName = $('.mName').text();
			var mTime = new Date().format();
			$
					.ajax({
						url : contextPath + "/main/message",
						method : 'POST',
						async : 'true',
						data : 'mname=' + mName + '&' + 'mcontent=' + mContent
								+ '&mtime=' + mTime,
						success : function(msg) {
							var error = msg.split('|')[1];
							if (error) {
								$('.msgError').text(error).css('display',
										'block');
								return;
							}
							var liId = 'msg'+ (mID + 1);
							var msgHtml = '<li id="'+ liId+ '">'+ $('.msgContainer > li').eq(0).html()+ '</li>';
							$('.msgContainer').append(msgHtml);
							var msg = $('#'+ liId);
					 		msg.find('.msgID').val();
							msg.find('.msgUserName').html(mName+ '&nbsp;'+ mTime);
							msg.find('.msgBox p').html(mContent);
							msg.find('.returnList').html('');
							$('.msgForm').slideUp();
							if ($('.msgForm').css('display') == 'none') {
								$('.msgForm').slideDown();
								$('#msgAction .slideSpan').removeClass(
										'glyphicon-menu-down').addClass(
										'glyphicon-menu-up');
							} else {
								if ($('#faces').css('display') != 'none')
									$('#faces').slideUp();
								$('.mContent').html('');
								$('.msgError').css('display', 'none');
								$('.msgForm').slideUp();
								$('#msgAction .slideSpan').removeClass(
										'glyphicon-menu-up').addClass(
										'glyphicon-menu-down');
							}

						},
						error : function() {
							$('#faces').slideUp();
							$('.mContent').html('');
							$('.msgError').text('抱歉出错了，暂时无法发表').css('display',
									'block');
						}
					});
		}
	}
});
