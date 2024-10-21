import AppDataSource from '../data-source';

export const ConnectDb = async () => {
    try {
        await AppDataSource.initialize();

        console.log('Connected to Database successfully');
    } catch (err: any) {
        console.log('Error connectiong to DB ' + err);
    }
};
