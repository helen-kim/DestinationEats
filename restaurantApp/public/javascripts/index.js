$(document).ready(function()  {
	$('#put').submit(createItem);
    $('#get').submit(getItem);
    $('#post').submit(updateItem);
    $('#delete').submit(deleteItem);

    function createItem(event) {
        name = document.getElementById('put_name').value;
        city = document.getElementById('put_city').value;
        type = document.getElementById('put_type').value;
        $('#put_result').empty();
        $.ajax({
            url: './list',
            type: 'PUT',
            data: { name: name, city: city, type: type },
            success:function(result){
                console.log("Successfully created item");
                $('#put_result').html(result);
            }
        });
        event.preventDefault();
    }

    function getItem(event) {
        name = document.getElementById('get_name').value;
        $('#get_result').empty();
        $.ajax({
            url: './list',
            type: 'GET',
            data: { name: name },
            success:function(result){
                console.log("Successfully retrieved item");
                $('#get_result').html(result);
            }
        });
        event.preventDefault();
    }

    function updateItem(event) {
        name = document.getElementById('post_name').value;
        city = document.getElementById('post_city').value;
        type = document.getElementById('post_type').value;

        $('#post_result').empty();
        $.ajax({
            url: './list',
            type: 'POST',
            data: { filter: name, update: [city, type] },
            success:function(result){
                console.log("Successfully updated item");
                $('#post_result').html(result);
            }
        });
        event.preventDefault();
    }

    function deleteItem(event) {
        name = document.getElementById('delete_name').value;
        $('#delete_result').empty();
        $.ajax({
            url: './list',
            type: 'DELETE',
            data: { name: name },
            success:function(result){
                console.log("Successfully deleted item");
                $('#delete_result').append(result);
            }
        });
        event.preventDefault();
    }
});