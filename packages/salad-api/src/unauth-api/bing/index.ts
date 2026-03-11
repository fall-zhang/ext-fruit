export const handleSearchRes = async ({
  doc,
  config,
}) => {
  const transform = getChsToChz(config.langCode)

  if (doc.querySelector('.client_def_hd_hd')) {
    return handleLexResult(doc, bingConfig.options, transform)
  }

  if (doc.querySelector('.client_trans_head')) {
    return handleMachineResult(doc, transform)
  }

  if (bingConfig.options.related) {
    if (doc.querySelector('.client_do_you_mean_title_bar')) {
      return handleRelatedResult(doc, transform)
    }
  }

  return handleNoResult<DictSearchResult<BingResult>>()
}