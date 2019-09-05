import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import { ListView as AntdListView, PullToRefresh, WhiteSpace } from 'antd-mobile';
import ScrollView from '../scroll-view';

const Container = function Container(props) {
  return (
    <div className="list-container">
      {props.separator && <WhiteSpace></WhiteSpace>}
      {props.children}
    </div>
  );
}

const ListView = function ListView (props) {

  const {query, renderItem, renderEmpty, separator = true, scrollView = false, renderHeader = null, pullToRefresh = true} = props
  const [isLoading, setLoading] = useState(false);
  const [isEmpty, setEmpty] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [data, setData] = useState(() => new AntdListView.DataSource({
    rowHasChanged : (preRow, nextRow) => preRow !== nextRow,
    getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID][rowID]
  }));

  const [refreshing, setRefreshing] = useState(false)
  const [fetch, setFetch] = useState(() => {})

  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      setLoading(true)
      const rows = await query();
      if (!didCancel) {
        setLoading(false)
        setHasMore(false)

        if (rows && rows.length > 0 ) {
          setData((data) => data.cloneWithRows(rows))
          setEmpty(false)
        } else {
          setEmpty(true)
        }
      }
    }

    fetchData();
    setFetch({fetchData});
    return () => didCancel = true;
  }, [query]);

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetch.fetchData().then(() => setRefreshing(false))
  }, [fetch])

  const renderRow = function renderRow (rowData, sectionID, rowID, highlightRow) {
    return <div key={rowID}>{renderItem(rowData, rowID, sectionID)}</div>
  }

  const renderSeparator = separator
    ? function renderSeparator(sectionID, rowID, adjacentRowHighlighted)  {
        return <WhiteSpace key={rowID}></WhiteSpace>
      }
    : null

  const onEndReached = function onEndReached (evt) {
    if (isLoading && !hasMore) {
      return;
    }
    // TODO set loading, load data
  }
  const view = (
    <AntdListView
        dataSource={data}
        onEndReached={onEndReached}
        renderRow={renderRow}
        renderSeparator={renderSeparator}
        renderHeader={renderHeader}
        renderFooter={isLoading ? () => (<div style={{ padding: 30, textAlign: 'center' }}> Loading... </div>) : null}
        renderBodyComponent={() => <Container separator={separator}/>}
        initialListSize={20}
        pageSize={20}
        scrollRenderAheadDistance={500}
        onEndReachedThreshold={600}
        useBodyScroll
        pullToRefresh={pullToRefresh ? <PullToRefresh
          distanceToRefresh={window.devicePixelRatio * 25}
          damping={100}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
        : false
      }
      />
  );

  return isEmpty
    ? renderEmpty
    : scrollView
      ? <ScrollView>{view}</ScrollView>
      : view
}

ListView.propTypes = {
  renderItem: PropTypes.func,
  renderEmpty: PropTypes.element,
  query: PropTypes.func,
  separator: PropTypes.bool
}

export default ListView;
