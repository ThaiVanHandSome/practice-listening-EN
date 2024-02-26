<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<table class="table table-striped table-responsive">
<thead class="thead-inverse">
<tr>
<th>Id</th>
<th>icon</th>
<th>Name</th>
<th>Actions</th>
</tr>
</thead>
</table>
<script type="text/javascript">
/* Get category */
$(document).ready(function() {
$.getJSON(contextPath + '/api/category', function(json) {
var tr=[];
for (var i = 0; i < json.length; i++) {
tr.push('<tr>');
tr.push('<td>' + json[i].categoryId + '</td>');
tr.push('<td>' + '<img
src="/admin/categories/images/'+ json[i].icon + '" style="width:70px" class="imgfluid" alt=""></td>');
tr.push('<td>' + json[i].categoryName + '</td>');
tr.push('<td>' + '<a href="#" data-id="'+
json[i].categoryId+'" id="editcate" class="btn btn-outline-warning"><i class="fa faedit"></i></a>'
+ '<a href="#" data-id="'+
json[i].categoryId+'" id="categoryId" class="btn btn-outline-danger"><i class="fa fatrash"></i></a>');
tr.push('</tr>');
}
$('table').append($(tr.join('')));
});
</script>
</body>
</html>