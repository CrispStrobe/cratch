import classNames from 'classnames';
import omit from 'lodash.omit';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';
import {connect} from 'react-redux';
import MediaQuery from 'react-responsive';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import tabStyles from 'react-tabs/style/react-tabs.css';
import VM from 'scratch-vm';
import Renderer from 'scratch-render';

import Blocks from '../../containers/blocks.jsx';
import CostumeTab from '../../containers/costume-tab.jsx';
import TargetPane from '../../containers/target-pane.jsx';
import SoundTab from '../../containers/sound-tab.jsx';
import StageWrapper from '../../containers/stage-wrapper.jsx';
import Loader from '../loader/loader.jsx';
import Box from '../box/box.jsx';
import MenuBar from '../menu-bar/menu-bar.jsx';
import CostumeLibrary from '../../containers/costume-library.jsx';
import BackdropLibrary from '../../containers/backdrop-library.jsx';
import Watermark from '../../containers/watermark.jsx';

import Backpack from '../../containers/backpack.jsx';
import WebGlModal from '../../containers/webgl-modal.jsx';
import TipsLibrary from '../../containers/tips-library.jsx';
import Cards from '../../containers/cards.jsx';
import Alerts from '../../containers/alerts.jsx';
import DragLayer from '../../containers/drag-layer.jsx';
import ConnectionModal from '../../containers/connection-modal.jsx';
import TelemetryModal from '../telemetry-modal/telemetry-modal.jsx';

import layout, {STAGE_SIZE_MODES} from '../../lib/layout-constants';
import {resolveStageSize} from '../../lib/screen-utils';
import {themeMap} from '../../lib/themes';

import styles from './gui.css';
import addExtensionIcon from './icon--extensions.svg';
import codeIcon from './icon--code.svg';
import costumesIcon from './icon--costumes.svg';
import soundsIcon from './icon--sounds.svg';

const messages = defineMessages({
    addExtension: {
        id: 'gui.gui.addExtension',
        description: 'Button to add an extension in the target pane',
        defaultMessage: 'Add Extension'
    }
});

const  iconRemove = (<svg width="25px" height="25px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="none">
    <g fill="#4778B8">
        <path d="M5.447,0.045C4.079,0.256 2.865,0.874 1.875,1.864C0.872,2.868 0.264,4.071 0.054,5.475C0.007,5.783 0,7.63 0,19.994C0,35.527 -0.014,34.402 0.211,35.263C0.493,36.342 1.054,37.303 1.875,38.124C2.697,38.946 3.658,39.507 4.736,39.789C5.597,40.014 4.472,40 20.002,40C35.44,40 34.418,40.014 35.218,39.803C36.333,39.51 37.308,38.946 38.129,38.124C39.136,37.117 39.747,35.902 39.951,34.498C40.001,34.166 40.004,32.519 39.997,19.833L39.986,5.543L39.904,5.15C39.358,2.589 37.483,0.695 34.897,0.102L34.486,0.006L20.127,0.002C8.001,-0.005 5.719,0.002 5.447,0.045ZM25.86,4.275L25.86,35.713L15.995,35.706C6.687,35.695 6.115,35.691 5.912,35.631C5.515,35.516 5.251,35.356 4.947,35.052C4.636,34.741 4.476,34.473 4.368,34.069C4.308,33.848 4.304,33.105 4.304,19.994C4.304,6.883 4.308,6.14 4.368,5.918C4.601,5.061 5.315,4.425 6.172,4.314C6.304,4.297 10.787,4.282 16.138,4.279L25.86,4.275ZM34.093,4.357C34.486,4.468 34.75,4.629 35.057,4.936C35.368,5.247 35.529,5.515 35.636,5.918C35.697,6.14 35.7,6.883 35.7,19.994C35.7,33.105 35.697,33.848 35.636,34.069C35.529,34.47 35.368,34.741 35.057,35.052C34.754,35.356 34.493,35.513 34.093,35.627C33.904,35.684 33.643,35.691 31.871,35.706L29.86,35.716L29.86,4.272L31.871,4.282C33.629,4.297 33.904,4.304 34.093,4.357Z"/>
        <path d="M21.63,8.693C21.13,8.825 21.298,8.682 15.815,13.773C12.986,16.402 10.629,18.599 10.582,18.656C10.275,19.028 10.125,19.449 10.125,19.949C10.125,20.464 10.268,20.882 10.575,21.253C10.782,21.5 20.78,30.767 20.998,30.91C21.398,31.178 21.933,31.285 22.426,31.203C23.691,30.985 24.423,29.692 23.969,28.488C23.866,28.205 23.759,28.045 23.53,27.805C23.434,27.709 21.505,25.912 19.244,23.808C16.979,21.703 15.126,19.971 15.126,19.96C15.126,19.949 17.019,18.181 19.333,16.034C21.644,13.887 23.612,12.043 23.701,11.936C24.016,11.561 24.162,11.147 24.162,10.636C24.162,10.057 23.984,9.625 23.576,9.225C23.159,8.81 22.726,8.632 22.141,8.639C21.966,8.639 21.737,8.664 21.63,8.693Z"/>
    </g>
</svg>);

const iconAdd = (<svg width="25px" height="25px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" fill="none">
    <g fill="#4778B8">
        <path d="M5.447,0.045C4.079,0.256 2.865,0.874 1.875,1.864C0.872,2.868 0.264,4.071 0.054,5.475C0.007,5.783 0,7.63 0,19.994C0,35.527 -0.014,34.402 0.211,35.263C0.493,36.342 1.054,37.303 1.875,38.124C2.697,38.946 3.658,39.507 4.736,39.789C5.597,40.014 4.472,40 20.002,40C35.44,40 34.418,40.014 35.218,39.803C36.333,39.51 37.308,38.946 38.129,38.124C39.136,37.117 39.747,35.902 39.951,34.498C40.001,34.166 40.004,32.519 39.997,19.833L39.986,5.543L39.904,5.15C39.358,2.589 37.483,0.695 34.897,0.102L34.486,0.006L20.127,0.002C8.001,-0.005 5.719,0.002 5.447,0.045ZM25.86,4.275L25.86,35.713L15.995,35.706C6.687,35.695 6.115,35.691 5.912,35.631C5.515,35.516 5.251,35.356 4.947,35.052C4.636,34.741 4.476,34.473 4.368,34.069C4.308,33.848 4.304,33.105 4.304,19.994C4.304,6.883 4.308,6.14 4.368,5.918C4.601,5.061 5.315,4.425 6.172,4.314C6.304,4.297 10.787,4.282 16.138,4.279L25.86,4.275ZM34.093,4.357C34.486,4.468 34.75,4.629 35.057,4.936C35.368,5.247 35.529,5.515 35.636,5.918C35.697,6.14 35.7,6.883 35.7,19.994C35.7,33.105 35.697,33.848 35.636,34.069C35.529,34.47 35.368,34.741 35.057,35.052C34.754,35.356 34.493,35.513 34.093,35.627C33.904,35.684 33.643,35.691 31.871,35.706L29.86,35.716L29.86,4.272L31.871,4.282C33.629,4.297 33.904,4.304 34.093,4.357Z"/>
        <path d="M12.657,8.693C13.157,8.825 12.99,8.682 18.472,13.773C21.301,16.402 23.659,18.599 23.705,18.656C24.012,19.028 24.162,19.449 24.162,19.949C24.162,20.464 24.019,20.882 23.712,21.253C23.505,21.5 13.508,30.767 13.29,30.91C12.89,31.178 12.354,31.285 11.861,31.203C10.597,30.985 9.864,29.692 10.318,28.488C10.421,28.205 10.529,28.045 10.757,27.805C10.854,27.709 12.782,25.912 15.043,23.808C17.308,21.703 19.162,19.971 19.162,19.96C19.162,19.949 17.269,18.181 14.954,16.034C12.643,13.887 10.675,12.043 10.586,11.936C10.271,11.561 10.125,11.147 10.125,10.636C10.125,10.057 10.304,9.625 10.711,9.225C11.129,8.81 11.561,8.632 12.147,8.639C12.322,8.639 12.55,8.664 12.657,8.693Z"/>
    </g>
</svg>
);


// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = props => {
    const {
        accountNavOpen,
        activeTabIndex,
        alertsVisible,
        authorId,
        authorThumbnailUrl,
        authorUsername,
        basePath,
        backdropLibraryVisible,
        backpackHost,
        backpackVisible,
        blocksId,
        blocksTabVisible,
        cardsVisible,
        canChangeLanguage,
        canChangeTheme,
        canCreateNew,
        canEditTitle,
        canManageFiles,
        canRemix,
        canSave,
        canCreateCopy,
        canShare,
        canUseCloud,
        children,
        connectionModalVisible,
        costumeLibraryVisible,
        costumesTabVisible,
        enableCommunity,
        intl,
        isCreating,
        isFullScreen,
        isPlayerOnly,
        isRtl,
        isShared,
        isTelemetryEnabled,
        isTotallyNormal,
        loading,
        logo,
        renderLogin,
        onClickAbout,
        onClickAccountNav,
        onCloseAccountNav,
        onLogOut,
        onOpenRegistration,
        onToggleLoginOpen,
        onActivateCostumesTab,
        onActivateSoundsTab,
        onActivateTab,
        onClickLogo,
        onExtensionButtonClick,
        onProjectTelemetryEvent,
        onRequestCloseBackdropLibrary,
        onRequestCloseCostumeLibrary,
        onRequestCloseTelemetryModal,
        onSeeCommunity,
        onShare,
        onShowPrivacyPolicy,
        onStartSelectingFileUpload,
        onTelemetryModalCancel,
        onTelemetryModalOptIn,
        onTelemetryModalOptOut,
        showComingSoon,
        soundsTabVisible,
        stageSizeMode,
        targetIsStage,
        telemetryModalVisible,
        theme,
        tipsLibraryVisible,
        vm,
        ...componentProps
    } = omit(props, 'dispatch');
    
 const [isSuffixAdded, setIsSuffixAdded] = useState(false);

    const toggleClassSuffix = () => {
        const prefix = 'gui_editor-wrapper';
        const suffix = styles['editor-wrapper-full-code'];
        const elements = document.querySelectorAll(`[class^="${prefix}"]`);
        const elements_stage = document.querySelectorAll("[class^='gui_stage-and-target-wrapper']");
        const buttonIcon = document.getElementById('button-full-code');

        if (isSuffixAdded) {
            elements.forEach(element => {
                element.classList.remove(`${suffix}`);
            });
            elements_stage.forEach(function(element) {
                element.style.display = 'flex';
            });
           
        } else {
            elements.forEach(element => {
                element.classList.add(`${suffix}`);
            });
            elements_stage.forEach(function(element) {
                element.style.display = 'none';
            });
           
        }

        window.dispatchEvent(new Event('resize'));
        setIsSuffixAdded(!isSuffixAdded);

    };




    if (children) {
        return <Box {...componentProps}>{children}</Box>;
    }





    const tabClassNames = {
        tabs: styles.tabs,
        tab: classNames(tabStyles.reactTabsTab, styles.tab),
        tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
        tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
        tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
        tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected)
    };

    if (isRendererSupported === null) {
        isRendererSupported = Renderer.isSupported();
    }

    return (<MediaQuery minWidth={layout.fullSizeMinWidth}>{isFullSize => {
        const stageSize = resolveStageSize(stageSizeMode, isFullSize);

        return isPlayerOnly ? (
            <StageWrapper
                isFullScreen={isFullScreen}
                isRendererSupported={isRendererSupported}
                isRtl={isRtl}
                loading={loading}
                stageSize={STAGE_SIZE_MODES.large}
                vm={vm}
            >
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
            </StageWrapper>
        ) : (
            <Box
                className={styles.pageWrapper}
                dir={isRtl ? 'rtl' : 'ltr'}
                {...componentProps}
            >
                {telemetryModalVisible ? (
                    <TelemetryModal
                        isRtl={isRtl}
                        isTelemetryEnabled={isTelemetryEnabled}
                        onCancel={onTelemetryModalCancel}
                        onOptIn={onTelemetryModalOptIn}
                        onOptOut={onTelemetryModalOptOut}
                        onRequestClose={onRequestCloseTelemetryModal}
                        onShowPrivacyPolicy={onShowPrivacyPolicy}
                    />
                ) : null}
                {loading ? (
                    <Loader />
                ) : null}
                {isCreating ? (
                    <Loader messageId="gui.loader.creating" />
                ) : null}
                {isRendererSupported ? null : (
                    <WebGlModal isRtl={isRtl} />
                )}
                {tipsLibraryVisible ? (
                    <TipsLibrary />
                ) : null}
                {cardsVisible ? (
                    <Cards />
                ) : null}
                {alertsVisible ? (
                    <Alerts className={styles.alertsContainer} />
                ) : null}
                {connectionModalVisible ? (
                    <ConnectionModal
                        vm={vm}
                    />
                ) : null}
                {costumeLibraryVisible ? (
                    <CostumeLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseCostumeLibrary}
                    />
                ) : null}
                {backdropLibraryVisible ? (
                    <BackdropLibrary
                        vm={vm}
                        onRequestClose={onRequestCloseBackdropLibrary}
                    />
                ) : null}
                <MenuBar
                    accountNavOpen={accountNavOpen}
                    authorId={authorId}
                    authorThumbnailUrl={authorThumbnailUrl}
                    authorUsername={authorUsername}
                    canChangeLanguage={canChangeLanguage}
                    canChangeTheme={canChangeTheme}
                    canCreateCopy={canCreateCopy}
                    canCreateNew={canCreateNew}
                    canEditTitle={canEditTitle}
                    canManageFiles={canManageFiles}
                    canRemix={canRemix}
                    canSave={canSave}
                    canShare={canShare}
                    className={styles.menuBarPosition}
                    enableCommunity={enableCommunity}
                    isShared={isShared}
                    isTotallyNormal={isTotallyNormal}
                    logo={logo}
                    renderLogin={renderLogin}
                    showComingSoon={showComingSoon}
                    onClickAbout={onClickAbout}
                    onClickAccountNav={onClickAccountNav}
                    onClickLogo={onClickLogo}
                    onCloseAccountNav={onCloseAccountNav}
                    onLogOut={onLogOut}
                    onOpenRegistration={onOpenRegistration}
                    onProjectTelemetryEvent={onProjectTelemetryEvent}
                    onSeeCommunity={onSeeCommunity}
                    onShare={onShare}
                    onStartSelectingFileUpload={onStartSelectingFileUpload}
                    onToggleLoginOpen={onToggleLoginOpen}
                />
                <Box className={styles.bodyWrapper}>
                    <Box className={styles.flexWrapper}>
                        <Box className={styles.editorWrapper}>
                            <Tabs
                                forceRenderTabPanel
                                className={tabClassNames.tabs}
                                selectedIndex={activeTabIndex}
                                selectedTabClassName={tabClassNames.tabSelected}
                                selectedTabPanelClassName={tabClassNames.tabPanelSelected}
                                onSelect={onActivateTab}
                            >
                                <TabList className={tabClassNames.tabList}>
                                    <Tab className={tabClassNames.tab}>
                                        <img
                                            draggable={false}
                                            src={codeIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Code"
                                            description="Button to get to the code panel"
                                            id="gui.gui.codeTab"
                                        />
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateCostumesTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={costumesIcon}
                                        />
                                        {targetIsStage ? (
                                            <FormattedMessage
                                                defaultMessage="Backdrops"
                                                description="Button to get to the backdrops panel"
                                                id="gui.gui.backdropsTab"
                                            />
                                        ) : (
                                            <FormattedMessage
                                                defaultMessage="Costumes"
                                                description="Button to get to the costumes panel"
                                                id="gui.gui.costumesTab"
                                            />
                                        )}
                                    </Tab>
                                    <Tab
                                        className={tabClassNames.tab}
                                        onClick={onActivateSoundsTab}
                                    >
                                        <img
                                            draggable={false}
                                            src={soundsIcon}
                                        />
                                        <FormattedMessage
                                            defaultMessage="Sounds"
                                            description="Button to get to the sounds panel"
                                            id="gui.gui.soundsTab"
                                        />
                                    </Tab>


                                </TabList>
 <div
                    id="button-full-code"
                    className={styles.specialTab}
                    onClick={toggleClassSuffix}
                 >
                     {isSuffixAdded ? iconRemove : iconAdd}
&nbsp;
                 </div>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    <Box className={styles.blocksWrapper}>
                                        <Blocks
                                            key={`${blocksId}/${theme}`}
                                            canUseCloud={canUseCloud}
                                            grow={1}
                                            isVisible={blocksTabVisible}
                                            options={{
                                                media: `${basePath}static/${themeMap[theme].blocksMediaFolder}/`
                                            }}
                                            stageSize={stageSize}
                                            theme={theme}
                                            vm={vm}
                                        />
                                    </Box>
                                    <Box className={styles.extensionButtonContainer}>
                                        <button
                                            className={styles.extensionButton}
                                            title={intl.formatMessage(messages.addExtension)}
                                            onClick={onExtensionButtonClick}
                                        >
                                            <img
                                                className={styles.extensionButtonIcon}
                                                draggable={false}
                                                src={addExtensionIcon}
                                            />
                                        </button>
                                    </Box>
                                    <Box className={styles.watermark}>
                                        <Watermark />
                                    </Box>
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {costumesTabVisible ? <CostumeTab vm={vm} /> : null}
                                </TabPanel>
                                <TabPanel className={tabClassNames.tabPanel}>
                                    {soundsTabVisible ? <SoundTab vm={vm} /> : null}
                                </TabPanel>
                            </Tabs>
                            {backpackVisible ? (
                                <Backpack host={backpackHost} />
                            ) : null}
                        </Box>

                        <Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
                            <StageWrapper
                                isFullScreen={isFullScreen}
                                isRendererSupported={isRendererSupported}
                                isRtl={isRtl}
                                stageSize={stageSize}
                                vm={vm}
                            />
                            <Box className={styles.targetWrapper}>
                                <TargetPane
                                    stageSize={stageSize}
                                    vm={vm}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <DragLayer />
            </Box>
        );
    }}</MediaQuery>);
};

GUIComponent.propTypes = {
    accountNavOpen: PropTypes.bool,
    activeTabIndex: PropTypes.number,
    authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    authorThumbnailUrl: PropTypes.string,
    authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
    backdropLibraryVisible: PropTypes.bool,
    backpackHost: PropTypes.string,
    backpackVisible: PropTypes.bool,
    basePath: PropTypes.string,
    blocksTabVisible: PropTypes.bool,
    blocksId: PropTypes.string,
    canChangeLanguage: PropTypes.bool,
    canChangeTheme: PropTypes.bool,
    canCreateCopy: PropTypes.bool,
    canCreateNew: PropTypes.bool,
    canEditTitle: PropTypes.bool,
    canManageFiles: PropTypes.bool,
    canRemix: PropTypes.bool,
    canSave: PropTypes.bool,
    canShare: PropTypes.bool,
    canUseCloud: PropTypes.bool,
    cardsVisible: PropTypes.bool,
    children: PropTypes.node,
    costumeLibraryVisible: PropTypes.bool,
    costumesTabVisible: PropTypes.bool,
    enableCommunity: PropTypes.bool,
    intl: intlShape.isRequired,
    isCreating: PropTypes.bool,
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
    isRtl: PropTypes.bool,
    isShared: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loading: PropTypes.bool,
    logo: PropTypes.string,
    onActivateCostumesTab: PropTypes.func,
    onActivateSoundsTab: PropTypes.func,
    onActivateTab: PropTypes.func,
    onClickAccountNav: PropTypes.func,
    onClickLogo: PropTypes.func,
    onCloseAccountNav: PropTypes.func,
    onExtensionButtonClick: PropTypes.func,
    onLogOut: PropTypes.func,
    onOpenRegistration: PropTypes.func,
    onRequestCloseBackdropLibrary: PropTypes.func,
    onRequestCloseCostumeLibrary: PropTypes.func,
    onRequestCloseTelemetryModal: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onShare: PropTypes.func,
    onShowPrivacyPolicy: PropTypes.func,
    onStartSelectingFileUpload: PropTypes.func,
    onTabSelect: PropTypes.func,
    onTelemetryModalCancel: PropTypes.func,
    onTelemetryModalOptIn: PropTypes.func,
    onTelemetryModalOptOut: PropTypes.func,
    onToggleLoginOpen: PropTypes.func,
    renderLogin: PropTypes.func,
    showComingSoon: PropTypes.bool,
    soundsTabVisible: PropTypes.bool,
    stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
    targetIsStage: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    theme: PropTypes.string,
    tipsLibraryVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};
GUIComponent.defaultProps = {
    backpackHost: null,
    backpackVisible: false,
    basePath: './',
    blocksId: 'original',
    canChangeLanguage: true,
    canChangeTheme: true,
    canCreateNew: false,
    canEditTitle: false,
    canManageFiles: true,
    canRemix: false,
    canSave: false,
    canCreateCopy: false,
    canShare: false,
    canUseCloud: false,
    enableCommunity: false,
    isCreating: false,
    isShared: false,
    isTotallyNormal: false,
    loading: false,
    showComingSoon: false,
    stageSizeMode: STAGE_SIZE_MODES.large
};

const mapStateToProps = state => ({
    // This is the button's mode, as opposed to the actual current state
    blocksId: state.scratchGui.timeTravel.year.toString(),
    stageSizeMode: state.scratchGui.stageSize.stageSize,
    theme: state.scratchGui.theme.theme
});

export default injectIntl(connect(
    mapStateToProps
)(GUIComponent));
