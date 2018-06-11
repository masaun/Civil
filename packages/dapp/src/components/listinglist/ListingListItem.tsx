import * as React from "react";
import { connect } from "react-redux";
// import styled from "styled-components";
import { State } from "../../reducers";
import { ListingWrapper, WrappedChallengeData, UserChallengeData } from "@joincivil/core";
import { NewsroomState } from "@joincivil/newsroom-manager";
// import ListingListItemDescription from "./ListingListItemDescription";
// import ListingListItemOwner from "./ListingListItemOwner";
// import ListingListItemStatus from "./ListingListItemStatus";
// import ListingListItemAction from "./ListingListItemAction";

import { ListingSummaryComponent } from "@joincivil/components";

export interface ListingListItemOwnProps {
  listingAddress?: string;
  challengeID?: string;
  even: boolean;
  user?: string;
}

export interface ListingListItemReduxProps {
  newsroom: NewsroomState | undefined;
  listing: ListingWrapper | undefined;
  challenge?: WrappedChallengeData;
  userChallengeData?: UserChallengeData;
}

class ListingListItem extends React.Component<ListingListItemOwnProps & ListingListItemReduxProps> {
  constructor(props: any) {
    super(props);
  }

  public render(): JSX.Element {
    const address = this.props.listingAddress;
    const newsroomData = this.props.newsroom!.wrapper.data;
    const description =
      "This will be a great description someday, but until then The Dude Abides. um i to you you call duder or so thats the dude thats what i am brevity thing um i let me duder or";
    const listingDetailURL = `/listing/${address}`;
    const listingData = {
      ...newsroomData,
      address,
      description,
      listingDetailURL,
    };
    return <ListingSummaryComponent {...listingData} />;
  }
}

const mapStateToProps = (
  state: State,
  ownProps: ListingListItemOwnProps,
): ListingListItemReduxProps & ListingListItemOwnProps => {
  const { newsrooms, listings, challenges, challengeUserData, user } = state;

  let listingAddress = ownProps.listingAddress;
  let challenge;
  if (!listingAddress && ownProps.challengeID) {
    challenge = challenges.get(ownProps.challengeID);
    listingAddress = challenges.get(ownProps.challengeID)!.listingAddress;
  }

  const newsroom = newsrooms.get(listingAddress!);
  const listing = listings.get(listingAddress!) ? listings.get(listingAddress!).listing : undefined;

  let challengeID = ownProps.challengeID;
  if (!challengeID && listing) {
    challengeID = listing.data.challengeID!.toString();
  }

  let userAcct = ownProps.user;
  if (!userAcct) {
    userAcct = user.account.account;
  }

  let userChallengeData;
  if (challengeID && userAcct) {
    const challengeUserDataMap = challengeUserData.get(challengeID!);
    if (challengeUserDataMap) {
      userChallengeData = challengeUserDataMap.get(userAcct);
    }
  }

  return {
    newsroom,
    listing,
    challenge,
    userChallengeData,
    ...ownProps,
  };
};

export default connect(mapStateToProps)(ListingListItem);
