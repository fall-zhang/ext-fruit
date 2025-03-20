export interface SelectionMock {
  hasSelection: jest.Mock
  getSelectionText: jest.Mock
  getSelectionSentence: jest.Mock
  getSelectionInfo: jest.Mock
  getDefaultSelectionInfo: jest.Mock
}

export default jest.genMockFromModule<SelectionMock>('../selection')
