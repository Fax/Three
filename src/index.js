var ThreeTest;
(function (ThreeTest) {
    //import ThreeJSTest = ThreeTest.ThreeJSTest;
    var MainApp = (function () {
        /**
         *
         */
        function MainApp() {
            this.handleOrientation = function (event) {
                console.log(event);
            };
            this.w = window.screen.width;
            this.h = window.screen.height;
            if (this.w > this.h) {
                this.three = new ThreeTest.ThreeJSTest(this.w, this.h);
            }
            else {
                this.three = new ThreeTest.ThreeJSTest(this.h, this.w);
            }
            window.addEventListener("deviceorientation", this.handleOrientation, true);
        }
        /**
         * start
         */
        MainApp.prototype.start = function () {
            this.three.start();
        };
        return MainApp;
    }());
    ThreeTest.MainApp = MainApp;
})(ThreeTest || (ThreeTest = {}));
