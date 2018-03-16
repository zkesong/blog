$.ajax({
	url:"http://localhost:8081/blogAPI/visitor",
	type:"get",
	dataType:"JSON",
	success:function(site){
	   var visitorCount = site.visitorCount;
	   $('#visitorCount').text(visitorCount);
	   $('#articleCount').text(site.articleCount);	
	   $.ajax({
			url:"http://localhost:8081/blogAPI/add",
			type:"post",
			cache: false,
			data:{
				  id:"1",
				  visitorCount:visitorCount+1,
				  articleCount:1
				},
			success:function(){
				 $('#visitorCount').text(visitorCount+1);			   
			}
		})				   
	}
});

		