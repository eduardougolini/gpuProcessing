const gpu = new GPU();

$('body input.imageUpload').on('change', function() {
    var reader = new FileReader();

    reader.onload = function (e) {
        $('#testImg').attr('src', e.target.result);
    }

    reader.readAsDataURL($(this)[0].files[0]);
});

$('body #testImg').on('load', function() {
    const render = gpu.createKernel(function() {
        this.color(0, 0, 0, 1);
    })
      .setOutput([$(this).width(), $(this).height()])
      .setGraphical(true);
        
    render();
    
    const canvas = render.getCanvas();
    document.getElementsByTagName('body')[0].appendChild(canvas);
});