function Render(jq,dom,data) {
	 this.$=jq;
     this.dom=dom;
     this.data=data;
}

Render.prototype.setStyle = function(attr,value){
         $(dom).css(attr,value);
};

Render.prototype.setAttr = function(attr,value){
      	 $(dom).atrr(attr,value);
};

Render.prototype.setDom = function(dom){
	     this.dom=dom;
};

Render.prototype.setData = function(data){
        this.data=data;
};