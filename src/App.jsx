import React from "react";
import { Spinner,Button } from "reactstrap";
import "./App.css";
import Page from "./Page.jsx";
import ModalPage from "./ModalPage.jsx";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentPage: 2,
      data: [],
      total_results: null,
      total_pages: null,
      loaded: true,
      im: "http://image.tmdb.org/t/p/w185",
      count:1,
      modalData:[],
      showModal: false,
      clickedModal:false
      
    };
  }
  prepareApiForFetch = () => {
    const api = `https://api.themoviedb.org/3/person/popular?api_key=df8b08ecb436696fee41a00f8d87a540&language=en&page=${this.state.currentPage}`;
    return api;
  };
  componentDidMount() {
    setTimeout(() => {
      this.createAPI();
      this.setState({ loaded: !this.state.loaded });
    }, 2000);
  }
  createAPI = () => {
    const url = this.prepareApiForFetch();
    fetch(url)
      .then((data) => data.json())
      .then((res) => {
        this.setState({
          data: res.results,
          currentPage: res.page,
          total_results: res.total_results,
          total_pages: res.total_pages
        });
      });
  };
  changePage = (currentPage) => {
    console.log("currr",currentPage)
    this.setState({loaded:true,data:[]})
    // const counter=0
    // while(currentPage>=5){
    //   counter++
    //   this.setState({count:counter})
    //   this.setState({ currentPage }, () => {
    //     this.createAPI();
    //   });
    // }
    setTimeout(()=>{
      this.setState({ currentPage,loaded:false }, () => {
        this.createAPI();
      });
    },1000)
    // this.setState({ currentPage }, () => {
    //   this.createAPI();
    // });
  };
  modal=(id)=>{
    const{data,modalData,clickedModal}=this.state
    console.log('id',id)
    const found=data.findIndex(item=> item.id===id)
    this.setState({modalData:data[found],clickedModal:true})
    console.log(data[found].name,"nameeee")
  }
  handleModalToggle = (status) => {
    this.setState({ clickedModal: !status });
  }
  render() {
    const { currentPage, data, im, modalData,clickedModal } = this.state;
    const a =  <Button variant="primary" disabled>
    <Spinner
      as="span"
      animation="grow"
      size="sm"
      role="status"
      aria-hidden="true"
    />
    Loading...
  </Button>;
    const isLoading = this.state.loaded ? a : "";
    
    const modalClicked= clickedModal ? <ModalPage handleModalToggle={this.handleModalToggle} modalData={modalData}/>: '';
    console.log(data);
    console.log(modalData);
    // console.log(im);
    return (
      <div className="app">
        <div className='head'>
          <div>
          <Page currentPage={currentPage} changePage={this.changePage} />
          </div>
          
          <div>{isLoading}</div>
          
        </div>
        
          <div className="movies">
            {data.map((item) => {
              const { profile_path, name, known_for,id } = item;
              const details = known_for.map((m) => m.title);
              const url = im + profile_path;
              return (
                <div onClick={()=>this.modal(id)} className="movie">
                  <img src={url} alt=" movies_image" />
                  <div className="title">{name}</div>
                  <div className="details">{details.join(",")}</div>
                </div>
              );
            })}
          </div>
          {modalClicked}
      </div>
    );
  }
}
export default App;
