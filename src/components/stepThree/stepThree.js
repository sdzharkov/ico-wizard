import React from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, checkWeb3, setExistingContractParams } from '../../utils/blockchainHelpers'
import { stepTwo } from '../stepTwo'
import { defaultCompanyStartDate } from './utils'
import { getOldState, stepsAreValid, allFieldsAreValid, defaultCompanyEndDate } from '../../utils/utils'
import { StepNavigation } from '../Common/StepNavigation'
import { InputField } from '../Common/InputField'
import { InputFieldExt } from '../Common/InputFieldExt'
import { RadioInputField } from '../Common/RadioInputField'
import { CrowdsaleBlock } from '../Common/CrowdsaleBlock'
import { WhitelistInputBlock } from '../Common/WhitelistInputBlock'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, intitialStepThreeValidations } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { contractStore, crowdsaleStore, pricingStrategyStore, stepThreeValidationsStore, crowdsaleBlockListStore, web3Store, tierCrowdsaleListStore} from '../../stores';
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, MINCAP, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME, ALLOWMODIFYING, DISABLEWHITELISTING } = TEXT_FIELDS
//stores to get
  //contracts
  //crowdsale
  //validations
  //pricing strategy
  //crowdsaleBlockListStore
  //web3,
	//tierCrowdsaleListStore
@inject('contractStore', 'crowdsaleBlockListStore', 'tierCrowdsaleListStore', 'pricingStrategyStore', 'web3Store') @observer
export class stepThree extends React.Component{
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    // const oldState = getOldState(props, defaultState)
    if (contractStore.crowdsale.addr.length > 0) {
      contractStore.setContractProperty('pricingStrategy','addr',[]);
      setExistingContractParams(contractStore.abi, contractStore.addr[0], contractStore.setContractProperty);
    }
    // oldState.children = [];
    crowdsaleBlockListStore.emptyList()
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'tier', "Tier 1" )
    // oldState.crowdsale[0].tier = "Tier 1"
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'updatable', "off" )
    // oldState.crowdsale[0].updatable = "off"
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'whitelistdisabled', "yes" )
    // oldState.crowdsale[0].whitelistdisabled = "yes"
    //this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: VALID, supply: EMPTY, rate: EMPTY } } )
    // this.state = Object.assign({}, oldState, intitialStepThreeValidations )
    //console.log('this.state', this.state)
  }

  addCrowdsale() {
    // let newState = {...this.state}
    let num = crowdsaleBlockListStore.crowdsaleBlockList.length + 1;
    // newState.crowdsale.push({
    //   tier: "Tier " + (num + 1),
    //   supply: 0,
    //   updatable: "off",
    //   whitelist:[], 
    //   whiteListElements: [], 
    //   whiteListInput:{}
    // });
    const newTier = {
      tier: "Tier " + (num + 1),
      supply: 0,
      updatable: "off",
      whitelist:[], 
      whiteListElements: [], 
      whiteListInput:{}
    }

    const newTierValidations = {
      tier: VALID,
      startTime: VALID,
      endTime: VALID,
      supply: EMPTY,
      rate: EMPTY
    }

    tierCrowdsaleListStore.addCrowdsaleItem(newTier)
    // newState.validations.push({
    //   tier: VALID,
    //   startTime: VALID,
    //   endTime: VALID,
    //   supply: EMPTY,
    //   rate: EMPTY
    // });
    stepThreeValidationsStore.addValidationItem(newTierValidations)
    //newState.crowdsale[num].startTime = newState.crowdsale[num - 1].endTime;
    //newState.crowdsale[num].endTime = defaultCompanyEndDate(newState.crowdsale[num].startTime);
    pricingStrategyStore.addStrategy({rate: 0});
    this.addCrowdsaleBlock(num)
  }

  addCrowdsaleBlock(num) {
    crowdsaleBlockListStore.addCrowdsaleBlock(
      <CrowdsaleBlock
        num = {num}
        state = {this.state}
        onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)}
        handleInputBlur={(parent, property, key) => this.handleInputBlur(parent, property, key)}
      />
    )
  }

  renderStandardLink () {
    return <Link to={{ pathname: '/4', query: { changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
  }

  /*renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      return this.renderStandardLink()
    }
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }*/

  renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || (allFieldsAreValid('crowdsale', this.state) && allFieldsAreValid('pricingStrategy', this.state))){
      console.log('steeeeeep 33333')
      return this.renderStandardLink()
    }
    console.log('not valid')
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    console.log('render link four')
    return <div>
    <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
    <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }

  renderLinkComponent () {
    //console.log(`stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)`, stepsAreValid(this.state.validations), allFieldsAreValid('crowdsale', this.state))
    if(stepsAreValid(this.state.validations) || (allFieldsAreValid('crowdsale', this.state) && allFieldsAreValid('pricingStrategy', this.state))){
      // console.log('step 3 is valididididididididididididididididi')
      return this.renderLink()
    }
    console.log('not valid')
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <div onClick={() => {
        this.showErrorMessages('crowdsale')
        this.showErrorMessages('pricingStrategy')
      }} className="button button_fill"> Continue</div>
    </div>
  }

  render() {
    const { validations } = this.state
    let { token } = this.state
    let { crowdsale } = this.state
    let { pricingStrategy } = this.state
    console.log('this.state.contractType', this.state.contractType)
    let globalSettingsBlock = <div><div className="section-title">
        <p className="title">Global limits</p>
      </div>
      <div className='input-block-container'>
        <InputField 
          side='left' 
          type='number' 
          title={MINCAP} 
          value={token.globalmincap} 
          valid={validations.globalmincap} 
          errorMessage={VALIDATION_MESSAGES.MINCAP} 
          onBlur={() => this.handleInputBlur('token', 'globalmincap')}
          onChange={(e) => this.changeState(e, 'token', 0, 'globalmincap')}
          description={`Minimum amount tokens to buy. Not a mininal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
        />
      </div></div>
    if (this.state.contractType === this.state.contractTypes.standard) {
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP}/>
          <div className="steps-content container">
            <div className="about-step">
                <div className="step-icons step-icons_crowdsale-setup"></div>  
              <p className="title">Crowdsale setup</p>
              <p className="description">
                The most important and exciting part of the crowdsale process. Here you can define parameters of your crowdsale campaign. 
              </p>
            </div>
            <div className="hidden">
              <div>
              <InputField 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={console.log('crowdsale[0].startTime', this.state) || crowdsale[0].startTime} 
                valid={validations[0].startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={crowdsale[0].endTime} 
                valid={validations[0].endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              </div>
              <div>
              <InputField 
                side='left' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={crowdsale[0].walletAddress} 
                valid={validations[0].walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}
                description={`Address where the money goes immediately after each successful transactions. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={crowdsale[0].supply} 
                valid={validations[0].supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY}
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)} 
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              </div>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={pricingStrategy[0].rate} 
                valid={validations[0].rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('pricingStrategy', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
            </div>
          </div>
          <div className="button-container">
            {this.renderStandardLinkComponent()}
          </div>
        </section>
      )
    } else if (this.state.contractType === this.state.contractTypes.whitelistwithcap) {
      let whitelistInputBlock = <div><div className="section-title">
              <p className="title">Whitelist</p>
            </div><WhitelistInputBlock
              num={0}
              onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, 0, prop)}
            ></WhitelistInputBlock></div>;
      return (
        <section className="steps steps_crowdsale-contract" ref="three">
          <StepNavigation activeStep={CROWDSALE_SETUP}/>
          <div className="steps-content container">
            <div className="about-step">
              <div className="step-icons step-icons_crowdsale-setup"></div>
              <p className="title">Crowdsale setup</p>
              <p className="description">
              The most important and exciting part of the crowdsale process. Here you can define parameters of your crowdsale campaign.
              </p>
            </div>
            <div className="hidden">
              <div className='input-block-container'>
              <InputField 
                side='left' 
                type='text' 
                title={CROWDSALE_SETUP_NAME} 
                value={crowdsale[0].tier}
                valid={validations[0].tier} 
                errorMessage={VALIDATION_MESSAGES.TIER} 
                onBlur={() => this.handleInputBlur('crowdsale', 'tier', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'tier')}
                description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
              />
              <InputFieldExt 
                side='right' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={crowdsale[0].walletAddress} 
                valid={validations[0].walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
                onBlur={() => this.handleInputBlur('crowdsale', 'walletAddress', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'walletAddress')}
                description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              </div>
              <div className='input-block-container'>
              <InputFieldExt 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={crowdsale[0].startTime} 
                valid={validations[0].startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'startTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'startTime')}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputFieldExt 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={crowdsale[0].endTime} 
                valid={validations[0].endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onBlur={() => this.handleInputBlur('crowdsale', 'endTime', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'endTime')}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              </div>
              <div className='input-block-container'>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={pricingStrategy[0].rate} 
                valid={validations[0].rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onBlur={() => this.handleInputBlur('pricingStrategy', 'rate', 0)}
                onChange={(e) => this.changeState(e, 'pricingStrategy', 0, 'rate')}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={crowdsale[0].supply} 
                valid={validations[0].supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY} 
                onBlur={() => this.handleInputBlur('crowdsale', 'supply', 0)}
                onChange={(e) => this.changeState(e, 'crowdsale', 0, 'supply')}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              </div>
              <div className='input-block-container'>
              <RadioInputField 
                  side='left' 
                  title={ALLOWMODIFYING} 
                  items={["on", "off"]}
                  vals={["on", "off"]}
                  state={this.state}
                  num={0}
                  defaultValue={this.state.crowdsale[0].updatable}
                  name='crowdsale-updatable-0'
                  onChange={(e) => this.changeState(e, 'crowdsale', 0, 'updatable')}
                  description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
              />
              <RadioInputField 
                  side='right' 
                  title={DISABLEWHITELISTING} 
                  items={["yes", "no"]}
                  vals={["yes", "no"]}
                  state={this.state}
                  num={0}
                  defaultValue={this.state.crowdsale[0].whitelistdisabled}
                  name='crowdsale-whitelistdisabled-0'
                  onChange={(e) => this.changeState(e, 'crowdsale', 0, 'whitelistdisabled')}
                  description={`Disables whitelistings. Anyone can buy on the tier.`}
              />
              </div>
              {this.state.crowdsale[0].whitelistdisabled === "no"?"":globalSettingsBlock}
            </div>
            {this.state.crowdsale[0].whitelistdisabled === "yes"?"":whitelistInputBlock}
          </div>
          <div>{this.state.children}</div>
          <div className="button-container">
            {this.renderLinkComponent()}
          </div>
        </section>
      )
    }
  }
}

import React from 'react'
import '../../assets/stylesheets/application.css';
import { Link } from 'react-router-dom'
import { getWeb3, checkWeb3, setExistingContractParams } from '../../utils/blockchainHelpers'
import { stepTwo } from '../stepTwo'
import { defaultCompanyStartDate } from './utils'
import { getOldState, stepsAreValid, allFieldsAreValid, defaultCompanyEndDate } from '../../utils/utils'
import { stepThree } from './stepThree'
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, intitialStepThreeValidations } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { CrowdsaleBlock } from '../Common/CrowdsaleBlock'
import { contractStore, crowdsaleStore, pricingStrategyStore, stepThreeValidationsStore, crowdsaleBlockListStore, web3Store, tierCrowdsaleListStore} from '../../stores';
const { CROWDSALE_SETUP } = NAVIGATION_STEPS
const { EMPTY, VALID, INVALID } = VALIDATION_TYPES
const { START_TIME, END_TIME, MINCAP, RATE, SUPPLY, WALLET_ADDRESS, CROWDSALE_SETUP_NAME, ALLOWMODIFYING, DISABLEWHITELISTING } = TEXT_FIELDS
//stores to get
  //contracts
  //crowdsale
  //validations
  //pricing strategy
  //crowdsaleBlockListStore
  //web3,
  //tierCrowdsaleListStore
@inject('contractStore', 'crowdsaleBlockListStore', 'tierCrowdsaleListStore', 'pricingStrategyStore', 'web3Store') @observer
export class stepThreeContaine extends React.Component{
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    // const oldState = getOldState(props, defaultState)
    if (contractStore.crowdsale.addr.length > 0) {
      contractStore.setContractProperty('pricingStrategy','addr',[]);
      setExistingContractParams(contractStore.abi, contractStore.addr[0], contractStore.setContractProperty);
    }
    // oldState.children = [];
    crowdsaleBlockListStore.emptyList()
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'tier', "Tier 1" )
    // oldState.crowdsale[0].tier = "Tier 1"
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'updatable', "off" )
    // oldState.crowdsale[0].updatable = "off"
    tierCrowdsaleListStore.setCrowdsaleItemProperty(0, 'whitelistdisabled', "yes" )
    // oldState.crowdsale[0].whitelistdisabled = "yes"
    //this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: VALID, supply: EMPTY, rate: EMPTY } } )
    // this.state = Object.assign({}, oldState, intitialStepThreeValidations )
    //console.log('this.state', this.state)
  }

  addCrowdsale() {
    // let newState = {...this.state}
    let num = crowdsaleBlockListStore.crowdsaleBlockList.length + 1;
    // newState.crowdsale.push({
    //   tier: "Tier " + (num + 1),
    //   supply: 0,
    //   updatable: "off",
    //   whitelist:[], 
    //   whiteListElements: [], 
    //   whiteListInput:{}
    // });
    const newTier = {
      tier: "Tier " + (num + 1),
      supply: 0,
      updatable: "off",
      whitelist:[], 
      whiteListElements: [], 
      whiteListInput:{}
    }

    const newTierValidations = {
      tier: VALID,
      startTime: VALID,
      endTime: VALID,
      supply: EMPTY,
      rate: EMPTY
    }

    tierCrowdsaleListStore.addCrowdsaleItem(newTier)
    // newState.validations.push({
    //   tier: VALID,
    //   startTime: VALID,
    //   endTime: VALID,
    //   supply: EMPTY,
    //   rate: EMPTY
    // });
    stepThreeValidationsStore.addValidationItem(newTierValidations)
    //newState.crowdsale[num].startTime = newState.crowdsale[num - 1].endTime;
    //newState.crowdsale[num].endTime = defaultCompanyEndDate(newState.crowdsale[num].startTime);
    pricingStrategyStore.addStrategy({rate: 0});
    this.addCrowdsaleBlock(num)
  }

  addCrowdsaleBlock(num) {
    crowdsaleBlockListStore.addCrowdsaleBlock(
      <CrowdsaleBlock
        num = {num}
        state = {this.state}
        onChange={(e, cntrct, num, prop) => this.changeState(e, cntrct, num, prop)}
        handleInputBlur={(parent, property, key) => this.handleInputBlur(parent, property, key)}
      />
    )
  }

  renderStandardLink () {
    return <Link to={{ pathname: '/4', query: { changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
  }

  /*renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)){
      return this.renderStandardLink()
    }
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }*/

  renderStandardLinkComponent () {
    if(stepsAreValid(this.state.validations) || (allFieldsAreValid('crowdsale', this.state) && allFieldsAreValid('pricingStrategy', this.state))){
      console.log('steeeeeep 33333')
      return this.renderStandardLink()
    }
    console.log('not valid')
    return <div onClick={() => this.showErrorMessages('crowdsale')} className="button button_fill"> Continue</div>
  }

  renderLink () {
    console.log('render link four')
    return <div>
    <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
    <Link to={{ pathname: '/4', query: { state: this.state, changeState: this.changeState } }}><a className="button button_fill">Continue</a></Link>
    </div>
  }

  renderLinkComponent () {
    //console.log(`stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)`, stepsAreValid(this.state.validations), allFieldsAreValid('crowdsale', this.state))
    if(stepsAreValid(this.state.validations) || (allFieldsAreValid('crowdsale', this.state) && allFieldsAreValid('pricingStrategy', this.state))){
      // console.log('step 3 is valididididididididididididididididi')
      return this.renderLink()
    }
    console.log('not valid')
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <div onClick={() => {
        this.showErrorMessages('crowdsale')
        this.showErrorMessages('pricingStrategy')
      }} className="button button_fill"> Continue</div>
    </div>
  }

  render() {
    return (
      <stepThree
         addCrowdsale={this.addCrowdsale}
        renderLinkComponent={this.renderLinkComponent}
        renderLink={this.renderLink}
        renderStandardLinkComponent={this.renderStandardLinkComponent}
        renderStandardLink={this.renderStandardLink}
        addCrowdsaleBlock={this.addCrowdsaleBlock} 
      />
    )
  }
}