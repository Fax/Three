var ThreeTest;
(function (ThreeTest) {
    //import ThreeJSTest = ThreeTest.ThreeJSTest;
    var MainApp = (function () {
        /**
         *
         */
        function MainApp() {
            console.log(Math.PI);
            this.three = new ThreeTest.ThreeJSTest(window.innerWidth, window.innerHeight);
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
