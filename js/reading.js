/**
 * js file of reading all
 */

// blog list
$(function(){
	var contextPath = $('.contextPath').val();
	$.getJSON("data/topTen", function(data) {
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
	forMobile();
	function forMobile() {
		if ($('body').width() <= 414){
			$('*').css('margin',' 0 ! important').css('font-size','27% ! important').css('overflow-y','scroll');
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
});