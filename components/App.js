import React, {Component} from 'react'
import FlippingPages from 'flipping-pages'
/* IMPORTANT */
import 'flipping-pages/FlippingPages.css'
  
class App extends Component {
 
    constructor(props) {
        super(props)
        this.totalPages = 4
        this.state = {
            selected: 0,
        }
        this.handleSelectedChange = this.handleSelectedChange.bind(this)
        this.previous = this.previous.bind(this)
        this.next = this.next.bind(this)
    }
 
    handleSelectedChange(selected) {
        this.setState({selected})
    }
 
    previous() {
        this.setState(state => ({
            selected: state.selected - 1
        }))
    }
 
    next() {
        this.setState(state => ({
            selected: state.selected + 1
        }))
    }
 
    render() {
        return (
            <div className="App">
                <FlippingPages
                    className="App-pages"
                    direction="horizontal"
                    selected={this.state.selected}
                    onSelectedChange={this.handleSelectedChange}
                    /* touch-action attribute is required by pointer events
                    polyfill */
                    touch-action="none"
                >
                    <div className="App-page App-page_red">0</div>
                    <div className="App-page App-page_green">1</div>
                    <div className="App-page App-page_blue">2</div>
                    <div className="App-page App-page_orange">3</div>
                </FlippingPages>
                {/* Buttons are required for keyboard navigation */}
                <button
                    onClick={this.previous}
                    disabled={!this.state.selected}
                >Previous</button>
                <button
                    onClick={this.next}
                    disabled={this.state.selected + 1 === this.totalPages}
                >Next</button>
                
                <style jsx>{`
                    .App-pages {
                        height: 480px;
                        width: 480px;
                        perspective: 960px;
                        -ms-user-select: none;
                        -moz-user-select: none;
                        -webkit-user-select: none;
                        user-select: none;
                    }
                     
                    .App-page {
                        color: white;
                        height: 100%;
                    }
                     
                    .App-page_red {
                        background: #f44336;
                    }
                     
                    .App-page_green {
                        background: #4caf50;
                    }
                     
                    .App-page_blue {
                        background: #2196f3;
                    }
                     
                    .App-page_orange {
                        background: #ff9800;
                    }
                `}</style>
            </div>
        )
    }
 
}
 
export default App