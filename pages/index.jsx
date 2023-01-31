import { useState } from 'react';
import Head from 'next/head';
import Loading from '../components/loading'
import { Inter } from '@next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function Home () {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([])

  const sendDescription = async () => {
    try {
      const request = await fetch('/api/', {
        method: 'POST',
        body: JSON.stringify({
          prompt: description,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const res = await request.json();
      if (res.message) {
        setLoading(false)
        setResult(res.result)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendDescription();
    setDescription('');
    setLoading(true);
  };

  if (loading) return <Loading />

  return (
    <>
      <Head>
        <title>AI name & logo generator</title>
        <meta name="description" content="Testing, testing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`flex flex-col items-center justify-center p-10 ${inter.variable}`}>
        <h1 className="text-2xl font-inter font-bold">AI name & logo generator</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-3/4 mt-10">
          <label htmlFor="description">Enter the description:</label>
          <textarea
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            rows="6"
            className="p-4 border rounded-lg"
          />
          <button
            type="submit"
            className="uppercase p-2 font-semibold bg-gray-200 w-[200px] mx-auto rounded-sm m-5"
          >
            Generate
          </button>
        </form>

        <div className="flex items-center mt-10">
          {result.length > 0 &&
            result.map((item, index) => (
              <div key={index}>
                <img src={`data:image/png;base64,${item?.logoImage}`}
                  alt={item.domainName} className="image" />
                <p>Domain: {item.domainName}</p>
              </div>
            ))}
        </div>
      </main>
    </>
  );
}
