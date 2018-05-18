const gpu = new GPU();
var rgbValues = [];

$('body input.imageUpload').on('change', function() {
    let img = new Image;

    img.onload = function (e) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);

        for (let i = 0; i < this.width; i++) {
            let row = [];
                
            for (let j = this.height; j > 0; j--) {
                let rgba = context.getImageData(i, j, 1, 1).data;
                row.push([rgba[0] / 255, rgba[1] / 255, rgba[2] / 255]);
                console.log("i: " + i + " - j: " + j + " | array -> " + [rgba[0] / 255, rgba[1] / 255, rgba[2] / 255]);
            }

            rgbValues.push(row);
            
        }
        
        renderImage(this.width, this.height);
    }

    img.src = URL.createObjectURL($(this)[0].files[0]);
});

var renderImage = function(width, height) {
    const render = gpu.createKernel(function(input) {
        var r = input[this.thread.x][this.thread.y][0];
        var g = input[this.thread.x][this.thread.y][1];
        var b = input[this.thread.x][this.thread.y][2];

        this.color(r, g, b, 1);
    })
      .setOutput([width, height])
      .setGraphical(true);
        
    render(rgbValues);
    
    const canvas = render.getCanvas();
    document.getElementsByTagName('body')[0].appendChild(canvas);
};