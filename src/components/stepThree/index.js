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
import { NAVIGATION_STEPS, defaultState, VALIDATION_MESSAGES, VALIDATION_TYPES, TEXT_FIELDS, intitialStepThreeValidations, CONTRACT_TYPES } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
// import { contractStore, crowdsaleStore, pricingStrategyStore, stepThreeValidationStore, crowdsaleBlockListStore, web3Store, tierCrowdsaleListStore} from '../../stores';
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
@inject('contractStore', 'crowdsaleBlockListStore', 'pricingStrategyStore', 
        'web3Store', 'tierStore', 'stepThreeValidationStore', 'contractStore', 
        'tierCrowdsaleListStore') @observer
export class stepThree extends React.Component{
  constructor(props) {
    super(props);
    window.scrollTo(0, 0);
    // const oldState = getOldState(props, defaultState)
    if (this.props.contractStore.crowdsale && this.props.contractStore.crowdsale.addr.length > 0) {
      this.props.contractStore.setContractProperty('pricingStrategy','addr',[]);
      setExistingContractParams(this.props.contractStore.abi, this.props.contractStore.addr[0], this.props.contractStore.setContractProperty);
    }
    // oldState.children = [];
    this.props.crowdsaleBlockListStore.emptyList()
    this.props.tierStore.setTierProperty("Tier 1", 'name', 0)
    // oldState.crowdsale[0].tier = "Tier 1"
    this.props.tierStore.setTierProperty( "off", 'updatable', 0)
    // oldState.crowdsale[0].updatable = "off"
    this.props.tierStore.setTierProperty( "yes", 'whitelistdisabled', 0)
    // oldState.crowdsale[0].whitelistdisabled = "yes"
    //this.state = Object.assign({}, oldState, {validations: { ...oldState.validations, startTime: VALID, endTime: VALID, walletAddress: VALID, supply: EMPTY, rate: EMPTY } } )
    // this.state = Object.assign({}, oldState, intitialStepThreeValidations )
    //console.log('this.state', this.state)
  }

  showErrorMessages = (parent) => {
    console.log('here!')
    this.props.tierStore.invalidateToken();
  }

  addCrowdsale = () => {
    // let newState = {...this.state}
    let num = 1
    if (this.props.crowdsaleBlockListStore.crowdsaleBlockList) {
      num = this.props.crowdsaleBlockListStore.crowdsaleBlockList.length + 1;      
    }

    const newTier = {
      tier: "Tier " + (num + 1),
      supply: 0,
      rate: 0,
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

    this.props.tierCrowdsaleListStore.addCrowdsaleItem(newTier)
    this.props.stepThreeValidationStore.addValidationItem(newTierValidations)
    //newState.crowdsale[num].startTime = newState.crowdsale[num - 1].endTime;
    //newState.crowdsale[num].endTime = defaultCompanyEndDate(newState.crowdsale[num].startTime);
    this.props.pricingStrategyStore.addStrategy({rate: 0});
    this.addCrowdsaleBlock(num)
  }

  updateCrowdsaleBlockListStore = (event, property, index) => {
    const { crowdsaleBlockListStore } = this.props
    const value = event.target.value;
    crowdsaleBlockListStore.setCrowdsaleBlockProperty(value, property, index);
    crowdsaleBlockListStore.validateCrowdsaleListBlockProperty(property, index);
  }

  updateTierStore = (event, property, index) => {
    const { tierStore } = this.props
    const value = event.target.value;
    tierStore.setTierProperty(value, property, index);
    tierStore.validateTiers(property, index)
  }

  updatePricingStrategyStore = (event, index, property) => {
    const { pricingStrategyStore } = this.props
    const value = event.target.value;
    pricingStrategyStore.setStrategyProperty(value, property, index);
  }

  addCrowdsaleBlock(num) {
    // this.props.crowdsaleBlockListStore.addCrowdsaleBlock(
    this.props.crowdsaleBlockListStore.addCrowdsaleItem(
      <CrowdsaleBlock num = {num}/>
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

  renderStandardLinkComponent = () => {
    if(this.props.tierStore.areTiersValid){
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

  renderLinkComponent() {
    //console.log(`stepsAreValid(this.state.validations) || allFieldsAreValid('crowdsale', this.state)`, stepsAreValid(this.state.validations), allFieldsAreValid('crowdsale', this.state))
    if(this.props.tierStore.areTiersValid){
      return this.renderLink()
    }
    
    console.log('not valid')
    return <div>
      <div onClick={() => this.addCrowdsale()} className="button button_fill_secondary"> Add Tier</div>
      <div onClick={this.showErrorMessages.bind(this)} className="button button_fill"> Continue</div>
    </div>
  }

    componentDidMount () {
      const { tierStore, web3Store } = this.props
      const accounts = web3Store.web3.eth.accounts
      tierStore.setTierProperty(accounts[0], 'walletAddress', 0)
      tierStore.setTierProperty(defaultCompanyStartDate(), 'startTime', 0)
      tierStore.setTierProperty(defaultCompanyEndDate(tierStore.tiers[0].startTime), 'endTime', 0)
    }

  render() {
    const { contractStore, pricingStrategyStore, crowdsaleBlockListStore, tierStore } = this.props
    const validations = crowdsaleBlockListStore.validCrowdsales
    // let { pricingStrategy } = this.state
    // console.log('this.state.contractType', this.state.contractType)
    let globalSettingsBlock = <div><div className="section-title">
        <p className="title">Global limits</p>
      </div>
      <div className='input-block-container'>
        <InputField 
          side='left' 
          type='number' 
          title={MINCAP} 
          value={tierStore.globalMinCap} 
          valid={VALID} 
          errorMessage={VALIDATION_MESSAGES.MINCAP} 
          onChange={(e) => tierStore.setGlobalMinCap(e.target.value)}
          description={`Minimum amount tokens to buy. Not a mininal size of a transaction. If minCap is 1 and user bought 1 token in a previous transaction and buying 0.1 token it will allow him to buy.`}
        />
      </div></div>
    if ( contractStore.contractType === CONTRACT_TYPES.standard) {
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
                value={tierStore.tiers[0].startTime} 
                valid={tierStore.validTiers[0].startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onChange={(e) => this.updateTierStore(e, 'startTime', 0)}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputField 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={tierStore.tiers[0].endTime} 
                valid={tierStore.validTiers[0].endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onChange={(e) => this.updateTierStore(e, 'endTime', 0)}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              </div>
              <div>
              <InputField 
                side='left' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={tierStore.tiers[0].walletAddress} 
                valid={tierStore.validTiers[0].walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS}
                onChange={(e) => this.updateTierStore(e, 'walletAddress', 0)}
                description={`Address where the money goes immediately after each successful transactions. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={tierStore.tiers[0].supply} 
                valid={tierStore.validTiers[0].supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY}
                onChange={(e) => this.updateTierStore(e, 'supply', 0)}
                description={`How many tokens will be sold on this tier. Cap of crowdsale equals to sum of supply of all tiers`}
              />
              </div>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={pricingStrategyStore.strategies[0].rate} 
                valid={true} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onChange={(e) => this.updatePricingStrategyStore(e, 'rate', 0)}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
            </div>
          </div>
          <div className="button-container">
            {this.renderStandardLinkComponent()}
          </div>
        </section>
      )
    } else if (contractStore.contractType === CONTRACT_TYPES.whitelistwithcap) {
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
                value={tierStore.tiers[0].name}
                valid={tierStore.validTiers[0].name} 
                errorMessage={VALIDATION_MESSAGES.TIER} 
                onChange={(e) => this.updateTierStore(e, 'name', 0)}
                description={`Name of a tier, e.g. PrePreIco, PreICO, ICO with bonus A, ICO with bonus B, etc. We simplified that and will increment a number after each tier.`}
              />
              <InputFieldExt 
                side='right' 
                type='text' 
                title={WALLET_ADDRESS} 
                value={tierStore.tiers[0].walletAddress} 
                valid={tierStore.validTiers[0].walletAddress} 
                errorMessage={VALIDATION_MESSAGES.WALLET_ADDRESS} 
                onChange={(e) => this.updateTierStore(e, 'walletAddress', 0)}
                description={`Where the money goes after investors transactions. Immediately after each transaction. We recommend to setup a multisig wallet with hardware based signers.`}
              />
              </div>
              <div className='input-block-container'>
              <InputFieldExt 
                side='left' 
                type='datetime-local' 
                title={START_TIME} 
                value={tierStore.tiers[0].startTime} 
                valid={tierStore.validTiers[0].startTime} 
                errorMessage={VALIDATION_MESSAGES.START_TIME} 
                onChange={(e) => this.updateTierStore(e, 'startTime', 0)}
                description={`Date and time when the tier starts. Can't be in the past from the current moment.`}
              />
              <InputFieldExt 
                side='right' 
                type='datetime-local' 
                title={END_TIME} 
                value={tierStore.tiers[0].endTime} 
                valid={tierStore.validTiers[0].endTime} 
                errorMessage={VALIDATION_MESSAGES.END_TIME} 
                onChange={(e) => this.updateTierStore(e, 'endTime', 0)}
                description={`Date and time when the tier ends. Can be only in the future.`}
              />
              </div>
              <div className='input-block-container'>
              <InputField 
                side='left' 
                type='number' 
                title={RATE} 
                value={tierStore.tiers[0].rate} 
                valid={tierStore.validTiers[0].rate} 
                errorMessage={VALIDATION_MESSAGES.RATE} 
                onChange={(e) => this.updateTierStore(e, 'rate', 0)}
                description={`Exchange rate Ethereum to Tokens. If it's 100, then for 1 Ether you can buy 100 tokens`}
              />
              <InputField 
                side='right' 
                type='number' 
                title={SUPPLY} 
                value={tierStore.tiers[0].supply} 
                valid={tierStore.validTiers[0].supply} 
                errorMessage={VALIDATION_MESSAGES.SUPPLY} 
                onChange={(e) => this.updateTierStore(e, 'supply', 0)}
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
                  defaultValue={tierStore.tiers[0].updatable}
                  name='crowdsale-updatable-0'
                  onChange={(e) => this.updateTierStore(e, 'updatable', 0)}
                  description={`Pandora box feature. If it's enabled, a creator of the crowdsale can modify Start time, End time, Rate, Limit after publishing.`}
              />
              <RadioInputField 
                  side='right' 
                  title={DISABLEWHITELISTING} 
                  items={["yes", "no"]}
                  vals={["yes", "no"]}
                  state={this.state}
                  num={0}
                  defaultValue={tierStore.tiers[0].whitelistdisabled}
                  name='crowdsale-whitelistdisabled-0'
                  onChange={(e) => this.updateTierStore(e, 'whitelistdisabled', 0)}
                  description={`Disables whitelistings. Anyone can buy on the tier.`}
              />
              </div>
              {tierStore.tiers[0].whitelistdisabled === "no"?"":globalSettingsBlock}
            </div>
            {tierStore.tiers[0].whitelistdisabled === "yes"?"":whitelistInputBlock}
          </div>
          <div>{crowdsaleBlockListStore.crowdSaleBlockList}</div>
          {/* <div>{crowdsaleBlockListStore.blockList}</div> */}
          <div className="button-container">
            {this.renderLinkComponent()}
          </div>
        </section>
      )
    }
  }
}
