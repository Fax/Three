namespace ThreeTest {
    //import ThreeJSTest = ThreeTest.ThreeJSTest;

    export class MainApp {

        private three: ThreeJSTest;
        /**
         *
         */
        constructor() {
            console.log(Math.PI);
            this.three = new ThreeJSTest(window.innerWidth, window.innerHeight);
        }
        /**
         * start
         */
        public start() {
            this.three.start();
        }
    }
}

