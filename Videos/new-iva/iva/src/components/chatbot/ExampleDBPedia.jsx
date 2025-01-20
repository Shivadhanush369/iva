import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot, { Loading } from 'react-simple-chatbot';

class MyAPI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
    this.prettifyResponse = this.prettifyResponse.bind(this);
  }

  componentDidMount() {
    const { steps } = this.props;
    const search = steps.search.value; // The input value from the chatbot
    const API_URL = 'http://127.0.0.1:8000/fetch_records';

    // Create the request body with the search input
    const bodydata = { text: search };

    // Fetch data from the API
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodydata),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.response?.content) {
          const formattedContent = this.prettifyResponse(data.response.content.trim());
          this.setState({ loading: false, result: formattedContent });
        } else {
          this.setState({ loading: false, result: 'No content found for your query.' });
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false, result: 'An error occurred while fetching data.' });
      });
  }

  prettifyResponse(rawString) {
    let formattedString = rawString
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/(#+)(.*)/g, (_, hashes, text) => `<h${hashes.length}>${text.trim()}</h${hashes.length}>`) // Headings
      .replace(/^\d+\.\s(.*)$/gm, '<li>$1</li>') // Ordered lists
      .replace(/^\*\s(.*)$/gm, '<li>$1</li>') // Unordered lists
      .replace(/<\/li>\s*(?=<li>)/g, '</li>') // Ensure valid list items
      .replace(/\n/g, '<br />'); // Line breaks
    return `<div>${formattedString}</div>`;
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { loading, result, trigger } = this.state;

    return (
      <div className="my-api">
        {loading ? <Loading /> : <div dangerouslySetInnerHTML={{ __html: result }} />}
        {!loading && !trigger && (
          <button onClick={this.triggetNext} style={{ marginTop: '20px' }}>
            Search Again
          </button>
        )}
      </div>
    );
  }
}

MyAPI.propTypes = {
  steps: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
};

const ExampleMyAPI = () => (
  <ChatBot
    steps={[
      { id: '1', message: 'Type something to search in the database.', trigger: 'search' },
      { id: 'search', user: true, trigger: '3' },
      { id: '3', component: <MyAPI />, waitAction: true, trigger: '1' },
    ]}
    floating={true}
  />
);

export default ExampleMyAPI;
