namespace ThreeTest {
    //import ThreeJSTest = ThreeTest.ThreeJSTest;

    export class MainApp {

        private three: ThreeJSTest;
        private w: number;
        private h: number;
        /**
         *
         */
        constructor() {
            this.w = window.screen.width;
            this.h = window.screen.height;
            if (this.w > this.h) {
                this.three = new ThreeJSTest(this.w,this.h);
            } else {
                this.three = new ThreeJSTest(this.h,this.w);
            }

            window.addEventListener("deviceorientation", this.handleOrientation, true);
        }
        /**
         * start
         */
        public start() {
            this.three.start();
        }

        public handleOrientation = (event) => { 
            console.log(event);
        }


    }
}

