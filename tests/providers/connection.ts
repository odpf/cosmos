import ConnectionProvider from 'src/providers/connection';

afterEach(() => {
  jest.resetAllMocks();
});

describe('ConnectionProvider', () => {
  describe('test', () => {
    test('should return Success if there is no error', async () => {
      const mockTestConnection = jest.fn().mockResolvedValueOnce('');
      // @ts-ignore
      const testDriver: BaseDriver = {
        testConnection: mockTestConnection
      };
      const spy = jest
        .spyOn<ConnectionProvider, any>(
          ConnectionProvider.prototype,
          'getDriver'
        )
        .mockReturnValueOnce(testDriver);
      const provider = new ConnectionProvider('postgres', {});
      const result = await provider.test();
      expect(result).toBe('Success');

      expect(mockTestConnection).toHaveBeenCalledTimes(1);
      expect(mockTestConnection).toHaveBeenCalledWith(/* empty */);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(/* empty */);
    });

    test('should return Failure if there is any error', async () => {
      const mockTestConnection = jest.fn().mockRejectedValue(new Error());
      // @ts-ignore
      const testDriver: BaseDriver = {
        testConnection: mockTestConnection
      };
      const spy = jest
        .spyOn<ConnectionProvider, any>(
          ConnectionProvider.prototype,
          'getDriver'
        )
        .mockReturnValueOnce(testDriver);
      const provider = new ConnectionProvider('postgres', {});
      const result = await provider.test();
      expect(result).toBe('Failure');

      expect(mockTestConnection).toHaveBeenCalledTimes(1);
      expect(mockTestConnection).toHaveBeenCalledWith(/* empty */);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(/* empty */);
    });
  });

  describe('getTablesList', () => {
    test('should return table list', async () => {
      const mockTableSchema = jest.fn().mockResolvedValueOnce({
        schema1: { table1: {}, table2: {} },
        schema2: { table1: {}, table2: {} }
      });
      // @ts-ignore
      const testDriver: BaseDriver = {
        tablesSchema: mockTableSchema
      };
      const spy = jest
        .spyOn<ConnectionProvider, any>(
          ConnectionProvider.prototype,
          'getDriver'
        )
        .mockReturnValueOnce(testDriver);
      const provider = new ConnectionProvider('bigquery', {});
      const result = await provider.getTablesList();
      expect(result).toEqual([
        { id: 'schema1.table1', name: 'table1' },
        { id: 'schema1.table2', name: 'table2' },
        { id: 'schema2.table1', name: 'table1' },
        { id: 'schema2.table2', name: 'table2' }
      ]);

      expect(mockTableSchema).toHaveBeenCalledTimes(1);
      expect(mockTableSchema).toHaveBeenCalledWith(/* empty */);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(/* empty */);
    });

    test('should return table list for postgres', async () => {
      const mockQuery = jest.fn().mockResolvedValueOnce([
        {
          table_schema: 'schema1',
          table_name: 'table1'
        },
        {
          table_schema: 'schema1',
          table_name: 'table2'
        },
        {
          table_schema: 'schema2',
          table_name: 'table1'
        },
        {
          table_schema: 'schema2',
          table_name: 'table2'
        }
      ]);
      // @ts-ignore
      const testDriver: BaseDriver = {
        query: mockQuery
      };
      const spy = jest
        .spyOn<ConnectionProvider, any>(
          ConnectionProvider.prototype,
          'getDriver'
        )
        .mockReturnValueOnce(testDriver);
      const provider = new ConnectionProvider('postgres', {});
      const result = await provider.getTablesList();
      expect(result).toEqual([
        { id: 'schema1.table1', name: 'table1' },
        { id: 'schema1.table2', name: 'table2' },
        { id: 'schema2.table1', name: 'table1' },
        { id: 'schema2.table2', name: 'table2' }
      ]);

      expect(mockQuery).toHaveBeenCalledTimes(1);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(/* empty */);
    });
  });
});
