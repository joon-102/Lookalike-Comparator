
import pixelmatch from 'https://esm.run/pixelmatch';

async function loadImageToCanvas(imgFile, canvas, width, height) {
    return new Promise((resolve, reject) => {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(imgFile);
        img.onload = () => {
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas);
        };
        img.onerror = reject;
    });
}

async function compareImages() {
    const img1 = document.getElementById('image1').files[0];
    const img2 = document.getElementById('image2').files[0];

    if (!img1 || !img2) {
        alert('이미지를 2개를 업로드 해주세요');
        return;
    }

    let canvas1 = document.getElementById('canvas1');
    let canvas2 = document.getElementById('canvas2');

    // 더미
    const diffCanvas = document.getElementById('diffCanvas');

    const imgElement1 = new Image();
    const imgElement2 = new Image();

    imgElement1.src = URL.createObjectURL(img1);
    imgElement2.src = URL.createObjectURL(img2);

    imgElement1.onload = () => {
        imgElement2.onload = async () => {
            const width = Math.max(imgElement1.width, imgElement2.width);
            const height = Math.max(imgElement1.height, imgElement2.height);

            if(imgElement1.height < imgElement1.height ) {
                canvas1 = document.getElementById('canvas1');
                canvas2 = document.getElementById('canvas2');
            }

            await loadImageToCanvas(img1, canvas1, width, height);
            await loadImageToCanvas(img2, canvas2, width, height);

            diffCanvas.width = width;
            diffCanvas.height = height;

            const ctx1 = canvas1.getContext('2d');
            const ctx2 = canvas2.getContext('2d');
            const diffCtx = diffCanvas.getContext('2d');

            const imgData1 = ctx1.getImageData(0, 0, width, height);
            const imgData2 = ctx2.getImageData(0, 0, width, height);
            const diffData = diffCtx.createImageData(width, height);

            const diff = pixelmatch(imgData1.data, imgData2.data, diffData.data, width, height, { threshold: 0.1 });

            diffCtx.putImageData(diffData, 0, 0);

            const similarity = 100 - (diff / (width * height)) * 100;
            document.getElementById('result').textContent = `닮은꼴 : ${similarity.toFixed(2)}%`;
        };
    };
}

document.getElementById('compareButton').onclick = compareImages;
