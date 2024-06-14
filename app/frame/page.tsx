"use client"
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const Page = () => {
    const searchParams = useSearchParams();
    const url = searchParams.get('url') || 'default';
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <div style={{ 
                border: '1px solid #ccc', 
                padding: '20px', 
                borderRadius: '8px', 
                textAlign: 'center', 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' 
            }}>
                <Link href={url}>
                    <div style={{ 
                        display: 'block', 
                        marginBottom: '10px', 
                        fontSize: '18px', 
                        color: '#0070f3', 
                        textDecoration: 'none' 
                    }}>
                        {url}
                    </div>
                </Link>
                <button onClick={copyToClipboard} style={{ 
                    padding: '10px 20px', 
                    fontSize: '16px', 
                    cursor: 'pointer', 
                    border: 'none', 
                    borderRadius: '4px', 
                    backgroundColor: '#0070f3', 
                    color: '#fff' 
                }}>
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>
    );
};

export default Page;