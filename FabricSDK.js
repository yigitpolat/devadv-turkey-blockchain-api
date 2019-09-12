'use strict';

import {FileSystemWallet, Gateway, X509WalletMixin} from 'fabric-network';
import dotenv from 'dotenv'
import path from 'path';

const ccpPath = path.resolve(__dirname, 'connection.json');
dotenv.config();

export async function queryCar(userName, carNumber) {
    try {
        const wallet = await getWallet(userName);
        const gateway = new Gateway(userName);
        const contract = await getContract(gateway, wallet, userName);
        const result = await contract.evaluateTransaction('queryCar', carNumber);
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to queryCar: ${error.message}`)
    }
}

export async function createCar(userName, carNumber, make, model, color, owner) {
    try {
        const wallet = await getWallet(userName);
        const gateway = new Gateway(userName);
        const contract = await getContract(gateway, wallet, userName);
        const result = await contract.submitTransaction('createCar', carNumber, make, model,color, owner);
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to createCar: ${error.endorsements[0].message}`);
    }
}

export async function queryAllCars(userName) {
    try {
        let wallet = await getWallet(userName);
        let gateway = new Gateway();
        let contract = await getContract(gateway, wallet, userName);
        const result = await contract.evaluateTransaction('queryAllCars');
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to queryAllCars: ${error}`);
    }
}

export async function changeCarOwner(userName, carNumber, newOwner) {
    try {
        const wallet = await getWallet(userName);
        const gateway = new Gateway(userName);
        const contract = await getContract(gateway, wallet, userName);
        const result = await contract.submitTransaction('changeCarOwner',carNumber, newOwner);
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to changeCarOwner: ${error.endorsements[0].message}`);
    }
}

export async function getHistoryForCar(userName, carNumber) {
    try {
        const wallet = await getWallet(userName);
        const gateway = new Gateway(userName);
        const contract = await getContract(gateway, wallet, userName);
        const result = await contract.evaluateTransaction('getHistoryForCar', carNumber);
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to getHistoryForCar: ${error}`);
    }
}

export async function deleteCar(userName, carNumber) {
    try {
        const wallet = await getWallet(userName);
        const gateway = new Gateway(userName);
        const contract = await getContract(gateway, wallet, userName);
        const result = await contract.submitTransaction('deleteCar', carNumber);
        await gateway.disconnect();
        return result;
    } catch (error) {
        throw new Error(`Failed to deleteCar: ${error}`);
    }
}

export async function registerUser(userName) {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);

        const userExists = await wallet.exists(userName);
        if (userExists) {
            throw new Error(`An identity for the user "${userName}" already exists in the wallet`);
        }

        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            throw new Error('An identity for the admin user "admin" does not exist in the wallet');
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {wallet, identity: 'admin', discovery: {enabled: true, asLocalhost: false}});

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: userName,
            role: 'client'
        }, adminIdentity);
        const enrollment = await ca.enroll({enrollmentID: userName, enrollmentSecret: secret});
        const userIdentity = X509WalletMixin.createIdentity('org1msp', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import(userName, userIdentity);

        return {userName: userName, userIdentity: userIdentity};

    } catch (error) {
        throw new Error(`Failed to registerUser: ${error}`);
    }
}

async function getWallet(userName) {
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    const userExists = await wallet.exists(userName);
    if (!userExists) {
        throw new Error(`An identity for the user ${userName} does not exist in the wallet. Please sign up before retrying.`);
    }
    return wallet;
}

async function getContract(gateway, wallet, userName) {
    await gateway.connect(ccpPath, {wallet, identity: userName, discovery: {enabled: true, asLocalhost: false}});
    const network = await gateway.getNetwork(process.env.channel_name);
    const contract = network.getContract(process.env.contract_name);
    return contract;
}