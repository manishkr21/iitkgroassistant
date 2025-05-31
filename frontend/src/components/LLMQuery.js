import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import env from '../resources/env.json';

const LLMQuery = ({ type, unique_id1, unique_id2, grievance_description }) => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseQuality, setresponseQuality] = useState('')
  const [url, setUrl] = useState('');
  const [payload, setPayload] = useState({});
  useEffect(() => {
    const callApiByType = async () => {
      if (!type) return;

      let url = '';
      switch (type) {
        case 'pension':
          url = env["BACKEND_API_URL"] + "get_gro_response";
          setUrl(url);
          setPayload({
            ppo_no: unique_id1,
            grievanceDescription: grievance_description
          });
          break;
        case 'mnrega':
          url = env["BACKEND_API_URL"] + "get_gro_mnrega_response";
          setUrl(url);
          setPayload({

            worker_id: unique_id1,
            work_id: unique_id2,
            grievanceDescription: grievance_description
          });
          break;
        default:
          console.warn('Unknown type, skipping API call.');
          return;
      }
    };

    callApiByType();
  }, [type, payload]);


  useEffect(() => {
    if (response) {
      const checkQuality = async () => {
        await handleGROQuery(grievance_description, response);
      };
      checkQuality();
    }
  }, [response, grievance_description]);


  const handleGROQuery = async (grievanceDescription, groresponse) => {
    try {
      const response = await fetch(env["BACKEND_API_URL"] + "check_gro_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          grievanceDescription,
          groresponse
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "this is for gro query")
      setresponseQuality(data.relevance)
    } catch (error) {
      setresponseQuality(`Error: ${error.message}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  const handleLLMQuery = async () => {
    setresponseQuality('')
    setLoading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.response || 'No response from LLM');

    } catch (error) {
      setResponse(`Error: ${error.message}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };



  function getEmoji(rating) {
    if (rating <= 0 || rating > 10) return '';
    if (rating <= 4) return '😕';       // Poor

    const emojis = {
      5: '😐',
      6: '🙂',
      7: '😎',
      8: '😍',
      9: '🤩',
      10: '🏆'
    };

    return emojis[rating];
  }



  return (

    <div style={{
      paddingTop: '1rem',
      fontFamily: 'Segoe UI, sans-serif',
      borderRadius: '8px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={handleLLMQuery}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#c98b40' : '#e3a460',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            minWidth: '150px',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            ...(loading ? {} : {
              // Hover effect only when not loading
              ':hover': {
                backgroundColor: '#d19055',  // Darker shade
              }
            })
          }}
        >
          {loading ? 'Loading...' : 'Ask LLM Response'}
        </button>




        {responseQuality && (
          <div>
            LLM Response Quality:{' '}
            <span style={{ fontSize: '34px', lineHeight: '1', verticalAlign: 'middle' }}>
              {getEmoji(responseQuality)}
            </span>
          </div>
        )}

      </div>



      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="LLM response will appear here..."
        rows={12}
        style={{
          width: '91%',
          padding: '1rem',
          fontSize: '0.8rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          resize: 'vertical',
          backgroundColor: '#fff',
          fontFamily: 'monospace',
          marginBottom: '1rem'
        }}
      />

      {response && <div
        style={{
          padding: '0 1rem',
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: '#333',
          marginRight: '1rem'
        }}
      >
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>}
    </div>

  );
};

export default LLMQuery;
