function init() {
    // UTILITY FUNCTIONS
    // generate random floating point number between min (inclusive) and max (exlusive)
    const rand = (max, min=0) => Math.random() * (max - min) + min
    // clamp number between min and max values
    const clamp = (value, min, max) => Math.min( Math.max(value, min), max)
    // binds every function in an instance's prototype to the instance itself
    const bind = function(instance) {
        var proto = instance.constructor.prototype,
            keys = Object.getOwnPropertyNames(proto),
            key;
        while (key = keys.pop()) if (typeof proto[key] === 'function' && key !== 'constructor') instance[key] = instance[key].bind(instance);
    }

    // STYLES HERE
    const fairyTransition = '0.7s ease-in-out, opacity 0.25s, width 0.05s, height 0.05s';
    const Style = {
        flexCenter: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        fairy: {
            zIndex: 9001,
            position: 'fixed',
            top: 0,
            left: 0,
            width: 100,
            height: 100,
            borderRadius: 50,
            WebkitTransition: fairyTransition,
            transition: fairyTransition
        },
        body: {
            position: 'absolute',
            zIndex: 9002,
            borderRadius: 50,
            WebkitTransition: fairyTransition,
            transition: fairyTransition,
            opacity: 0.75,
            boxShadow: '10px 10px 60px rgba(0,0,0,0.33)'
        },

        bubble: {
            zIndex: 9003,
            position: 'absolute',
            width: 150,
            padding: 10,
            borderRadius: 30,
            backgroundColor: '#fff',
            color: 'white',
            fontSize: 12,
            fontWeight: 'bold',
            textAlign: 'center',
            pointerEvents: 'none',
            boxShadow: '10px 10px 30px rgba(0,0,0,0.33)'
        },
        top: {
            top: -30
        },
        right: {
            right: -130
        },
        left: {
            left: -130
        },
        bottom: {
            bottom: -30
        },

        wing: {
            position: 'absolute',
            WebkitTransition: 'transform 0.1s',
            transition: 'transform 0.1s',
            opacity: 0.8
        },
        upperRightWing: {
            top: -50,
            right: -50,
            transformOrigin: 'left bottom'
        },
        upperLeftWing: {
            top: -50,
            left: -50,
            transformOrigin: 'right bottom'
        },
        lowerLeftWing: {
            bottom: -15,
            left: -15,
            transformOrigin: 'right top'
        },
        lowerRightWing: {
            bottom: -15,
            right: -15,
            transformOrigin: 'left top'
        }
    };

    const fairyWingPath = "M1013.53,9.9C749.767,87.036,513.255,234.616,330.9,438.873,184.523,602.825,77.917,797.8,17.565,1009.84c340.426-20.481,603.649-116.011,741.48-315.459C837.026,581.537,850.882,446.133,904.756,282.7A2441.748,2441.748,0,0,1,1013.53,9.9Z";
    var React = window.React;
    class Fairy extends React.Component {
        constructor(props, context) {
            super(props, context)

            this.margin = 100
            this.getScreenBounds()
            
            this.state = {
                text: message(),
                bubblePos: Object.assign({}, Style.top, Style.right),
                wingAngle: 10,
                style: {
                    top: rand(this.height - 100, this.margin),
                    left: rand(this.width - 100, this.margin),
                    width: 100,
                    height: 100
                }
            }

            this.canChangeText = true
            this.canMove = true

            bind(this)
        }

        render() {
            var propStyle = { // this style used as background of outer div, as well as last child element (to cover wings)
                backgroundImage: `radial-gradient(circle at center, white 30%, ${this.props.color} 45%, white 80%)`,
                width: this.state.style.width,
                height: this.state.style.height
            }
            return (
                E('div', {
                    ref: (el) => this.el = el,
                    style: Object.assign({}, Style.fairy, Style.flexCenter, {
                        opacity: this.props.lit ? 1 : 0,
                        transform: `translate(calc(${this.state.style.left}px - 50%), calc(${this.state.style.top}px - 50%))`
                    }),
                    onClick: this.onClick,
                    onMouseOver: this.onMouseOver
                },
                    E('span',
                        { style: Object.assign({}, Style.bubble, this.state.bubblePos, { color: this.props.color }) },
                        this.state.text
                    ),
                    E('div', { style: Object.assign({}, Style.body, propStyle) }),
                    E('div',
                        { style: Object.assign({}, Style.wing, Style.upperRightWing, { transform: `rotate(${this.state.wingAngle}deg)` }) },
                        E('svg', { xmlns: "http://www.w3.org/2000/svg", width: "100", height:"100", viewBox:"0 0 1024 1024" },
                            E('path',
                                { style: { fill: "rgba(235,255,255,0.95)" }, d: fairyWingPath }
                            )
                        )
                    ),
                    E('div',
                        { style: Object.assign({}, Style.wing, Style.lowerRightWing, { transform: `rotate(${(this.state.wingAngle)}deg)`}) },
                        E('svg',
                            { xmlns: "http://www.w3.org/2000/svg", style: { transform: 'scale(1, -1)' }, width:"50", height:"50", viewBox:"0 0 1024 1024" },
                            E('path',
                                { style: { fill: "rgba(235,255,255,0.95)" }, d: fairyWingPath }
                            )
                        )
                    ),
                    E('div',
                        { style: Object.assign({}, Style.wing, Style.upperLeftWing, { transform: `rotate(${(-1 * this.state.wingAngle)}deg)`}) },
                        E('svg',
                            { xmlns: "http://www.w3.org/2000/svg", style: { transform: 'scale(-1, 1)' }, width:"100", height:"100", viewBox:"0 0 1024 1024" },
                            E('path',
                                { style: { fill: "rgba(235,255,255,0.95)" }, d: fairyWingPath }
                            )
                        )
                    ),
                    E('div',
                        { style: Object.assign({}, Style.wing, Style.lowerLeftWing, { transform: `rotate(${(-1 * this.state.wingAngle)}deg)`}) },
                        E('svg', 
                            { xmlns: "http://www.w3.org/2000/svg", style: { transform: 'scale(-1, -1)' }, width: "50", height: "50", viewBox: "0 0 1024 1024" },
                            E('path',
                                { style: {fill: "rgba(235,255,255,0.95)" }, d: fairyWingPath }
                            )
                        )
                    ),
                    E('div', { style: Object.assign({}, Style.body, propStyle) })
                )
            )
        }

        componentDidMount() {
            window.addEventListener("resize", this.onResize)
            window.addEventListener("scroll", this.onScroll)
            this.flapID = window.setInterval(this.flap, 100)
        }

        componentWillUnmount() {
            window.removeEventListener("resize", this.onResize)
            window.removeEventListener("scroll", this.onScroll)
            window.clearInterval(this.flapID)
        }

        getScreenBounds() {
            this.width = window.innerWidth - this.margin
            this.height = window.innerHeight - this.margin
            this.midWidth = this.margin + (this.width - this.margin) / 2
            this.midHeight = this.margin + (this.height - this.margin) / 2
        }

        // keep fairy within screen bounds when screen size is changing
        onResize(e) {
            this.getScreenBounds()

            if (this.state.style.top > (this.height - this.state.style.width)
            || this.state.style.left > (this.width - this.state.style.width)) {
                this.move()
                this.flicker(rand(10, 4) >> 0)
            }
        }

        // move the fairy when scrolling
        onScroll(e) {
            if (rand(1) < 0.01) this.move()
        }

        // make the fairy flee when clicked
        onClick() {
            // move 600-1000 pixels away
            // can trap the fairy in a corner
            let distance = rand(1000, 600) * rand(1) < 0.5 ? 1 : -1
            this.move(this.state.style.top + distance, this.state.style.left + distance)
            this.flicker(rand(10, 4) >> 0)
        }

        // fairies don't like to be held
        onMouseOver() {
            // use canChangeText to prevent message from cycling too fast to be read
            if (this.canChangeText) {
                this.canChangeText = false;
                this.setState({ text: message() })
                window.setTimeout(() => this.canChangeText = true, 3000)
            }
            if (this.canMove) {
                this.canMove = false
                // move 200-400 pixels away
                this.move(this.state.style.top + (rand(400, 200) * (rand(1) < 0.5 ? -1 : 1)), this.state.style.left + (rand(400, 200) * (rand(1) < 0.5 ? -1 : 1)))
                window.setTimeout(() => this.canMove = true, 1000)
            }
        }

        // moves the fairy to given position, or if no arguments: moves the fairy to a random location
        move(top, left) {
            if (this.flutterID) window.clearTimeout(this.flutterID)
            // if top or left arguments exist then clamp them to within the bounds of the screen
            // else generate new random location
            top = clamp(top !== undefined ? top : rand(this.height - this.state.style.width, this.margin), this.margin, this.height)
            left = clamp(left !== undefined ? left : rand(this.width - this.state.style.width, this.margin), this.margin, this.width)
            Object.assign(this.state.style, {
                top,
                left
            })
            // this is most convenient time to set the text bubble position
            this.setState({
                bubblePos: Object.assign({}, Style[top <= this.midHeight ? 'bottom' : 'top'], Style[left <= this.midWidth ? 'right' : 'left'])
            })
            this.flutterID = window.setTimeout(this.flutter, 1100, rand(4, 2) >> 0)
        }

        // moves the fairy randomly in small increments
        // async recursive function using count to limit how many times it runs the animation
        flutter(count) {
            // don't execute if component is not mounted
            if (this.el === undefined) return;
            
            // set position to some random point close to current position, and clamp within the bounds of the screen
            // using Object assign as setState() doesn't merge state.objects nicely and clobbers unmentined variables
            Object.assign(this.state.style, {
                top: clamp((this.state.style.top + rand(10, -10)) >> 0, this.margin, this.height),
                left: clamp((this.state.style.left + rand(10, -10)) >> 0, this.margin, this.width)
            })
            this.forceUpdate()

            if (count) this.flutterID = window.setTimeout(this.flutter, rand(1600, 1100) >> 0, --count)
        }

        // flickers the fairy by shrinking and growing it's body repeatedly
        // async recursive function using count to limit how many times it runs the animation
        flicker(count) {
            // don't execute if component is not mounted
            if (this.el === undefined) return;

            // calculate new width & heighth
            var dim = count % 2 ? rand(80, 60) >> 0 : 100
            // using Object assign as setState() doesn't merge state.objects nicely and clobbers unmentioned variables
            Object.assign(this.state.style, {
                width: dim,
                height: dim
            })
            this.forceUpdate()

            if (count) window.setTimeout(this.flicker, 50, --count)
        }
        
        // flap wings
        flap() {
            // don't execute if component is not mounted
            if (this.el === undefined) return;

            // alternate wing angle
            this.setState({ wingAngle: this.state.wingAngle * -1 })
        }
    }

    var messageIndex = 0
    const message = () => {switch(messageIndex++) {
        case 0: return "I dare you to click me."
        case 1: return "I graduated in May! Hooray!"
        case 2: return "Hey! Hire me!"
        case 3: return "I'd love to hear from you."
        case 4: return "Call me sometime."
        case 5: return "Aaron was here!"
        default:
            messageIndex = 0
            return "This is the end..."
    }};

    var E = React.createElement;
    var isLit = true;
    var mountPoint = document.getElementById('fairy_mount_point');

    function toggle() {
        isLit = !isLit;
        render();
    }

    function render() {
        ReactDOM.render(
            E(Fairy, { lit: isLit, color: '#0cf' }, null),
            mountPoint
        );
        timerID = window.setTimeout(toggle, rand(2000, 500));
    }
    render();
}

var timerID = null;
function checkIfReactLoaded() {
    let isReady = false;
    try {
        if (React !== undefined && ReactDOM !== undefined) {
            isReady = true;
            init();
        }
    } catch (err) {
        // do nothing
    }
    if (isReady === false)
        timerID = window.setTimeout(checkIfReactLoaded, 250);
}
timerID = window.setTimeout(checkIfReactLoaded, 250);