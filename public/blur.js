//sigma=2
var gusArray=[0.199471,0.176033,0.120985,0.06475,0.026995,0.008764];
onmessage=function(e){
	let iw=e.data.iw,ih=e.data.ih;
	let imgdata=e.data.imgdata;
	let blurimg=new Uint8ClampedArray(iw*ih*4);
	let bimg2nd=new Uint8ClampedArray(iw*ih*4);
	for(let i=0;i<ih;i++){
		for(let j=0;j<iw;j++){
			let r=0,g=0,b=0,a=0;
			for(let k=1;k<gusArray.length;k++){
				if(j+k<iw){
					r+=imgdata[(i*iw+j+k)*4]*gusArray[k];
					g+=imgdata[(i*iw+j+k)*4+1]*gusArray[k];
					b+=imgdata[(i*iw+j+k)*4+2]*gusArray[k];
				}
				if(j-k>=0){
					r+=imgdata[(i*iw+j-k)*4]*gusArray[k];
					g+=imgdata[(i*iw+j-k)*4+1]*gusArray[k];
					b+=imgdata[(i*iw+j-k)*4+2]*gusArray[k];
				}
			}
			blurimg[(i*iw+j)*4]=r+imgdata[(i*iw+j)*4]*gusArray[0];
			blurimg[(i*iw+j)*4+1]=g+imgdata[(i*iw+j)*4+1]*gusArray[0];
			blurimg[(i*iw+j)*4+2]=b+imgdata[(i*iw+j)*4+2]*gusArray[0];
			blurimg[(i*iw+j)*4+3]=a+imgdata[(i*iw+j)*4+3];
		}
	}
	for(let i=0;i<ih;i++){
		for(let j=0;j<iw;j++){
			let r=0,g=0,b=0,a=0;
			for(let k=1;k<gusArray.length;k++){
				if(i+k<ih){
					r+=blurimg[((i+k)*iw+j)*4]*gusArray[k];
					g+=blurimg[((i+k)*iw+j)*4+1]*gusArray[k];
					b+=blurimg[((i+k)*iw+j)*4+2]*gusArray[k];
				}
				if(i-k>=0){
					r+=blurimg[((i-k)*iw+j)*4]*gusArray[k];
					g+=blurimg[((i-k)*iw+j)*4+1]*gusArray[k];
					b+=blurimg[((i-k)*iw+j)*4+2]*gusArray[k];
				}
			}
			bimg2nd[(i*iw+j)*4]=r+blurimg[(i*iw+j)*4]*gusArray[0];
			bimg2nd[(i*iw+j)*4+1]=g+blurimg[(i*iw+j)*4+1]*gusArray[0];
			bimg2nd[(i*iw+j)*4+2]=b+blurimg[(i*iw+j)*4+2]*gusArray[0];
			bimg2nd[(i*iw+j)*4+3]=a+blurimg[(i*iw+j)*4+3];
		}
	}
	postMessage(bimg2nd);
}