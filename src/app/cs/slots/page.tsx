// pages/index.js
'use client'
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useSearchParams } from 'next/navigation'
import slot3Image from './images/plug.png';
import { app } from '../../../../firebaseConfig';
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import QR from '../../../components/qrGenerator';
import io from 'socket.io-client'


const db = getFirestore(app)

const ChargingStation = (props) => {
    const [renderedItemss, setRenderedItemss] = useState<JSX.Element[]>([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const renderedItems: JSX.Element[] = [];
    let index;
    const id = props.searchParams.id;
    const docRef = doc(db, "shop", id!)
    const docRefs = doc(db, "shop", `${id!}`)
    const socket = io("ws://192.168.1.6:5002")
    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDoc(docRef)
            console.log(snapshot.data())
            index = snapshot.data().slot;
            for (let i = 0; i < index; i++) {
                renderedItems.push(
                    <li key={i} onClick={() => handleSlotSelect(i)} className={"my-6"}>
                        <label htmlFor={`Charger${i}`} className='font-medium flex items-center space-x-10 child:mx-2 cursor-pointer' >
                            <img src={slot3Image.src} alt={`Charger ${i}`} className={styles.slotImage} />
                            <h1>{`Charger ${i + 1}`}</h1>
                            <input type="radio" id={`Charger${i}`} name="Charger" disabled={buttonClicked} defaultChecked={selectedSlot === i} />
                        </label>
                    </li>
                );
            }
            setRenderedItemss(renderedItems);

        }
        fetchData();
        socket.on("connect", () => {
            console.log(socket.id); // x8WIv7-mJelg7on_ALbx
          });
        socket.on("percentage", (arg) => {
            console.log(arg); // world
          })
          return(()=>{
            socket.close();
          })

    }, [id, buttonClicked]);
    const [selectedSlot, setSelectedSlot] = useState<number>();
    const [inputValue, setInputValue] = useState('');
    const [inputValueC, setInputValueC] = useState('');
    const [connectBut, setConnectBut] = useState('Connect');

    const handleSlotSelect = (slot: number) => {
        setSelectedSlot(slot);
    };
    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleChangeC = (event) => {
        setInputValueC(event.target.value);
    };


    return (
        <div>
            <QR text={id} />
            <h1 className='text-4xl mb-8 uppercase font-bold'>Connect to a charging slot</h1>
            <ul className='flex flex-col items-center'>
                {renderedItemss}
            </ul>
            <div className='flex justify-center items-center space-x-4 my-8'>
                <label>Current in KW : </label>
                <input className='text-center mx-auto border border-gray-300 p-2 rounded-md'
                    type="number"
                    id="textInput"
                    min="0"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Current KWh"
                />
                <br />
                <label>Total Capacity in KW : </label>
                <input className='text-center mx-auto border border-gray-300 p-2 rounded-md'
                    type="number"
                    id="textInput"
                    min="0"
                    value={inputValueC}
                    onChange={handleChangeC}
                    placeholder="Capacity in KWh"
                />
            </div>
            <div className='flex justify-center my-8'>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={(value) => {
                    if (value.target.innerHTML == "Connect" || value.target.innerHTML == "Reconnect") {
                        console.log(selectedSlot)
                        if (selectedSlot != null && inputValue != '' && inputValueC != '') {
                            updateDoc(docRefs, `charger.${selectedSlot}`, { timestamp: Date.now(), currentBattery: inputValue, TotalBattery: inputValueC, Charging:false })
                            setButtonClicked(true);
                            setConnectBut("Disconnect")
                            setTimeout(() =>{
                                // updateDoc(docRefs, `charger.${selectedSlot}`, { timestamp: 0, currentBattery: inputValue, TotalBattery: inputValueC })
                                setButtonClicked(false);
                                setConnectBut("Connect")
                            }, 120000)
                        }
                    } else {
                        updateDoc(docRefs, `charger.${selectedSlot}`, { timestamp: 0, currentBattery: inputValue, TotalBattery: inputValueC,Charging:false })
                        setButtonClicked(false);
                        setConnectBut("Connect")
                    }
                }
                } >
                    {connectBut}
                </button>

            </div>
        </div>
    );
};

export default ChargingStation;