import { useRef, useState } from "react";
import styles from "./Main.module.css";
import { ethers, parseEther } from "ethers";
import Image from "next/image";
import omg from "../../public/kran.jpg";

const Main = () => {
  const [errorMessage, setErrorMessage] = useState(false);
  const [sucMessage, setSucMessage] = useState(false);
  const [checkMessage, setCheckMessage] = useState(false);
  const [checkMessageErr, setCheckMessageErr] = useState(false);
  const [hash, setHash] = useState("");

  const payRef = useRef();
  const whiteRef = useRef();
  const whiteAmountRef = useRef();
  const checkRef = useRef();

  const contractAddress = "0xf117DeB01fAABeedD501bd24506276A21781d728";
  const contractAbi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_user",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "addWhitePapper",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "AddWhitePapper",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "MoneySent",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "_user",
          type: "address",
        },
      ],
      name: "payMoney",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "fallback",
    },
    {
      inputs: [],
      name: "withdrawMoney",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
    {
      inputs: [],
      name: "getBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "whitePapper",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "withDrawals",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  let provider;
  let signer = null;

  if (typeof window !== "undefined") {
    provider = new ethers.BrowserProvider(window.ethereum);
  } else {
    provider = new ethers.JsonRpcProvider();
  }

  const submitPayBnb = async (e) => {
    e.preventDefault();
    setErrorMessage(false);
    setSucMessage(false);
    setCheckMessage(false);
    setCheckMessageErr(false);
    signer = await provider.getSigner();
    const contractFaucetWithSigner = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const address = payRef.current.value;

    if (!address) {
      setErrorMessage(true);
      return;
    }

    try {
      const response = await contractFaucetWithSigner.payMoney(address);
      setSucMessage(true);
      setHash(response.hash);
    } catch (error) {
      setErrorMessage(true);
      console.error(error);
    }
  };
  const submitWhitePapper = async (e) => {
    e.preventDefault();
    setErrorMessage(false);
    setSucMessage(false);
    setCheckMessage(false);
    setCheckMessageErr(false);
    signer = await provider.getSigner();
    const contractFaucetWithSigner = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    const whiteAddress = whiteRef.current.value;
    const whiteAmount = whiteAmountRef.current.value;

    if (!whiteAddress || !whiteAmount) {
      setErrorMessage(true);
      return;
    }
    try {
      const response = await contractFaucetWithSigner.addWhitePapper(
        whiteAddress,
        parseEther(whiteAmount)
      );
      setSucMessage(true);
      setHash(response.hash);
    } catch (error) {
      setErrorMessage(true);
      console.error(error);
    }
  };

  const submitCheck = async (e) => {
    e.preventDefault();
    setErrorMessage(false);
    setSucMessage(false);
    setCheckMessage(false);
    setCheckMessageErr(false);
    const contractFaucet = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider
    );

    const checkAddress = checkRef.current.value;

    if (!checkAddress) {
      setErrorMessage(true);
      return;
    }
    try {
      const response = await contractFaucet.whitePapper(checkAddress);
      if (response.toString() == 0) {
        setCheckMessageErr(true);
      } else {
        setCheckMessage(true);
      }
    } catch (error) {
      setErrorMessage(true);
      console.error(error);
    }
  };

  return (
    <>
      <h2 className={styles.subtitle}>Получить тестовые бнб</h2>
      <form className={styles.forms} onSubmit={submitPayBnb}>
        <label className={styles.labels} htmlFor="addresForPay">
          Your address:{" "}
        </label>
        <input
          ref={payRef}
          className={styles.inputs}
          type="text"
          name="addresForPay"
          id="addresForPay"
          placeholder="Your address"
        />
        <input className={styles.submits} type="submit" value="Получить BNB" />
      </form>
      <h2 className={styles.subtitle}>
        Добавить пользователя в вайтлист - только для owner
      </h2>
      <form className={styles.forms} onSubmit={submitWhitePapper}>
        <label className={styles.labels} htmlFor="addresForWhiteList">
          Address:{" "}
        </label>
        <input
          ref={whiteRef}
          className={styles.inputs_sec}
          type="text"
          name="addresForWhiteList"
          id="addresForWhiteList"
          placeholder="Address"
        />
        <label className={styles.labels} htmlFor="amountForWhiteList">
          Amount:
        </label>
        <input
          ref={whiteAmountRef}
          className={styles.inputs_three}
          type="number"
          name="amountForWhiteList"
          id="amountForWhiteList"
          placeholder="amount"
          min="0"
          step=".1"
        />
        <input className={styles.submits} type="submit" value="Добавить" />
      </form>
      <h2 className={styles.subtitle}>Найти себя в списках</h2>
      <form className={styles.forms} onSubmit={submitCheck}>
        <label className={styles.labels} htmlFor="addresForCheck">
          Your address:
        </label>
        <input
          ref={checkRef}
          className={styles.inputs}
          type="text"
          name="addresForCheck"
          id="addresForCheck"
          placeholder="Check address"
        />
        <input className={styles.submits} type="submit" value="Найди себя" />
      </form>
      {errorMessage && <h3 className={styles.err}>Ошибочка тут у нас</h3>}
      {sucMessage && (
        <div className={styles.suc}>
          <h3>Все супер! А это хэш:</h3>
          <h4>{hash}</h4>
        </div>
      )}
      {checkMessage && <h3 className={styles.check}>Вы в списках</h3>}
      {checkMessageErr && <h3 className={styles.check}>Упс! Вы кто?</h3>}
      {!errorMessage && !sucMessage && !checkMessage && (
        <Image
          src={omg}
          width={500}
          height={350}
          alt="preview"
          className={styles.imgs}
        />
      )}
    </>
  );
};

export default Main;
