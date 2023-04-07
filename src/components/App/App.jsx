import { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import fetchImages from '../../services/images-api';
import Searchbar from 'components/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';
import Loader from 'components/Loader';
import Modal from 'components/Modal';

class App extends Component {
  state = {
    query: '',
    page: 1,
    totalImages: 0,
    isLoading: false,
    showModal: false,
    images: [],
    error: null,
    currentImageUrl: null,
    currentImageDescription: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { query, page, error } = this.state;

    if (prevState.query !== query || prevState.page !== page) {
      this.setState({ isLoading: true, error: null });

      if (prevState.error !== error && error) {
        toast.error(error);
      }
      fetchImages(query, page)
        .then(({ hits, totalHits }) => {
          const imagesArray = hits.map(
            ({ id, tags, webformatURL, largeImageURL }) => ({
              id: id,
              description: tags,
              smallImage: webformatURL,
              largeImage: largeImageURL,
            })
          );

          if (!imagesArray.length) {
            toast('Images not found');
            return;
          }

          return this.setState(prevState => ({
            images: [...prevState.images, ...imagesArray],
            totalImages: totalHits,
          }));
        })
        .catch(error => this.setState({ error: error.message }))
        .finally(() => this.setState({ isLoading: false }));
    }
  }

  getSearchRequest = query => {
    this.setState({ query, images: [], page: 1 });
  };

  onNextFetch = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  closeModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      currentImageUrl: null,
      currentImageDescription: null,
    }));
  };

  openModal = ({ description, largeImage }) => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
      currentImageUrl: largeImage,
      currentImageDescription: description,
    }));
  };

  render() {
    const {
      images,
      totalImages,
      isLoading,
      showModal,
      currentImageUrl,
      currentImageDescription,
    } = this.state;

    const { getSearchRequest, onNextFetch, openModal, closeModal } = this;

    return (
      <>
        <Searchbar onSubmit={getSearchRequest} />

        {images && <ImageGallery images={images} openModal={openModal} />}

        {isLoading && <Loader />}

        {!isLoading && totalImages !== images.length && (
          <Button onNextFetch={onNextFetch} />
        )}

        {showModal && (
          <Modal
            onClose={closeModal}
            currentImageUrl={currentImageUrl}
            currentImageDescription={currentImageDescription}
          />
        )}

        <ToastContainer />
      </>
    );
  }
}

export default App;
