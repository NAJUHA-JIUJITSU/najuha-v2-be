# NAJUHA V2 ERD

> Generated by [`typeorm-markdown-generator`](https://github.com/hermin9804/typeorm-markdown-generator)



## Table of Contents



- [User](#user)
- [Application](#application)
- [Competition](#competition)


## User

```mermaid
erDiagram
  policy {
    varchar id PK
    integer version
    varchar type
    boolean isMandatory
    varchar title
    text content
    timestamptz createdAt
  }
  policy_consent {
    varchar id PK
    timestamptz createdAt
    varchar userId FK
    varchar policyId FK
  }
  user {
    varchar id PK
    varchar role
    varchar snsAuthProvider
    varchar snsId
    varchar email
    varchar name
    varchar phoneNumber "nullable"
    varchar nickname "nullable"
    varchar gender "nullable"
    varchar birth "nullable"
    varchar belt "nullable"
    varchar profileImageUrlKey "nullable"
    varchar status
    timestamptz createdAt
    timestamptz updatedAt
  }
  policy_consent }o--|| user: user
  policy_consent }o--|| policy: policy
```

### `policy`

Policy Entity   
@namespace User

**Properties**

  - `id`
  - `version`
  - `type`
  - `isMandatory`
  - `title`
  - `content`
  - `createdAt`


### `policy_consent`

PolicyConsent Entity   
@namespace User

**Properties**

  - `id`
  - `createdAt`
  - `userId`
  - `policyId`: - policyId.


### `user`

User Entity   
@namespace User   
@erd Competition   
@erd Application

**Properties**

  - `id`
  - `role`
  - `snsAuthProvider`
  - `snsId`
  - `email`
  - `name`
  - `phoneNumber`
  - `nickname`
  - `gender`
  - `birth`
  - `belt`
  - `profileImageUrlKey`
  - `status`
  - `createdAt`
  - `updatedAt`


## Application

```mermaid
erDiagram
  player_snapshot {
    varchar id PK
    varchar name
    varchar gender
    varchar birth
    varchar phoneNumber
    varchar belt
    varchar network
    varchar team
    varchar masterName
    timestamptz createdAt
    varchar applicationId FK
  }
  payment_snapshot {
    varchar id PK
    timestamptz createdAt
    integer normalAmount
    integer earlybirdDiscountAmount
    integer combinationDiscountAmount
    integer totalAmount
    varchar applicationId FK
  }
  participation_divsion_info_snapshot {
    varchar id PK
    timestamptz createdAt
    varchar participationDivisionInfoId FK
    varchar participationDivisionId FK
  }
  participation_division_info {
    varchar id PK
    timestamptz createdAt
    varchar applicationId FK
  }
  participation_division_info_payment {
    varchar id PK
    timestamptz createdAt
    varchar divisionId FK
    varchar priceSnapshotId FK
    varchar participationDivisionInfoId FK
  }
  additional_info {
    varchar id PK
    timestamptz createdAt
    timestamptz updatedAt
    varchar type
    varchar value
    varchar applicationId FK
  }
  application {
    varchar id PK
    timestamptz createdAt
    timestamptz updatedAt
    timestamptz deletedAt "nullable"
    varchar type
    varchar status
    varchar competitionId FK
    varchar userId FK
  }
  user {
    varchar id PK
    varchar role
    varchar snsAuthProvider
    varchar snsId
    varchar email
    varchar name
    varchar phoneNumber "nullable"
    varchar nickname "nullable"
    varchar gender "nullable"
    varchar birth "nullable"
    varchar belt "nullable"
    varchar profileImageUrlKey "nullable"
    varchar status
    timestamptz createdAt
    timestamptz updatedAt
  }
  player_snapshot }|--|| application: application
  payment_snapshot }o--|| application: application
  participation_divsion_info_snapshot }|--|| participation_division_info: participationDivisionInfo
  participation_division_info }|--|| application: application
  participation_division_info_payment |o--|| participation_division_info: participationDivisionInfo
  additional_info }o--|| application: application
  application }o--|| user: user
```

### `player_snapshot`

PlayerSnapshot Entity   
@namespace Application

**Properties**

  - `id`
  - `name`
  - `gender`
  - `birth`
  - `phoneNumber`
  - `belt`
  - `network`
  - `team`
  - `masterName`
  - `createdAt`
  - `applicationId`


### `payment_snapshot`

PaymentSnapshot Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `normalAmount`
  - `earlybirdDiscountAmount`
  - `combinationDiscountAmount`
  - `totalAmount`
  - `applicationId`


### `participation_divsion_info_snapshot`

ParticipationDivisionInfoSnapshot Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `participationDivisionInfoId`
  - `participationDivisionId`


### `participation_division_info`

ParticipationDivisionInfo Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `applicationId`


### `participation_division_info_payment`

ParticipationDivisionInfoPayment Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `divisionId`
  - `priceSnapshotId`
  - `participationDivisionInfoId`


### `additional_info`

AdditionalInfo Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `updatedAt`
  - `type`
  - `value`
  - `applicationId`


### `application`

Application Entity   
@namespace Application

**Properties**

  - `id`
  - `createdAt`
  - `updatedAt`
  - `deletedAt`
  - `type`
  - `status`
  - `competitionId`
  - `userId`


## Competition

```mermaid
erDiagram
  price_snapshot {
    varchar id PK
    integer price
    timestamptz createdAt
    varchar divisionId FK
  }
  division {
    varchar id PK
    varchar category
    varchar uniform
    varchar gender
    varchar belt
    varchar weight
    varchar birthYearRangeStart
    varchar birthYearRangeEnd
    varchar status
    timestamptz createdAt
    timestamptz updatedAt
    varchar competitionId FK
  }
  earlybird_discount_snapshot {
    varchar id PK
    timestamptz earlybirdStartDate
    timestamptz earlybirdEndDate
    integer discountAmount
    timestamptz createdAt
    varchar competitionId FK
  }
  combination_discount_snapshot {
    varchar id PK
    jsonb combinationDiscountRules
    timestamptz createdAt
    varchar competitionId FK
  }
  required_additional_info {
    varchar id PK
    varchar type
    varchar description
    timestamptz createdAt
    timestamptz deletedAt "nullable"
    varchar competitionId FK
  }
  competition_host {
    varchar id PK
    varchar hostId FK
    varchar competitionId FK
  }
  competition {
    varchar id PK
    varchar title
    varchar address
    timestamptz competitionDate "nullable"
    timestamptz registrationStartDate "nullable"
    timestamptz registrationEndDate "nullable"
    timestamptz refundDeadlineDate "nullable"
    timestamptz soloRegistrationAdjustmentStartDate "nullable"
    timestamptz soloRegistrationAdjustmentEndDate "nullable"
    timestamptz registrationListOpenDate "nullable"
    timestamptz bracketOpenDate "nullable"
    text description
    boolean isPartnership
    integer viewCount
    varchar posterImgUrlKey "nullable"
    varchar status
    timestamptz createdAt
    timestamptz updatedAt
  }
  user {
    varchar id PK
    varchar role
    varchar snsAuthProvider
    varchar snsId
    varchar email
    varchar name
    varchar phoneNumber "nullable"
    varchar nickname "nullable"
    varchar gender "nullable"
    varchar birth "nullable"
    varchar belt "nullable"
    varchar profileImageUrlKey "nullable"
    varchar status
    timestamptz createdAt
    timestamptz updatedAt
  }
  price_snapshot }|--|| division: division
  division }o--|| competition: competition
  earlybird_discount_snapshot }o--|| competition: competition
  combination_discount_snapshot }o--|| competition: competition
  required_additional_info }o--|| competition: competition
  competition_host }o--|| user: user
  competition_host }o--|| competition: competition
```

### `price_snapshot`

PriceSnapshot Entity   
@namespace Competition

**Properties**

  - `id`
  - `price`
  - `createdAt`
  - `divisionId`


### `division`

Division Entity   
@namespace Competition

**Properties**

  - `id`
  - `category`
  - `uniform`
  - `gender`
  - `belt`
  - `weight`
  - `birthYearRangeStart`
  - `birthYearRangeEnd`
  - `status`
  - `createdAt`
  - `updatedAt`
  - `competitionId`


### `earlybird_discount_snapshot`

EarlybirdDiscountSnapshot Entity   
@namespace Competition

**Properties**

  - `id`
  - `earlybirdStartDate`
  - `earlybirdEndDate`
  - `discountAmount`
  - `createdAt`
  - `competitionId`


### `combination_discount_snapshot`

CombinationDiscountSnapshot Entity   
@namespace Competition

**Properties**

  - `id`
  - `combinationDiscountRules`
  - `createdAt`
  - `competitionId`


### `required_additional_info`

RequiredAdditionalInfo Entity   
@namespace Competition

**Properties**

  - `id`
  - `type`
  - `description`
  - `createdAt`
  - `deletedAt`
  - `competitionId`


### `competition_host`

Competition Host Map Entity   
@namespace Competition

**Properties**

  - `id`
  - `hostId`
  - `competitionId`


### `competition`

Competition Entity   
@namespace Competition

**Properties**

  - `id`
  - `title`
  - `address`
  - `competitionDate`
  - `registrationStartDate`
  - `registrationEndDate`
  - `refundDeadlineDate`
  - `soloRegistrationAdjustmentStartDate`
  - `soloRegistrationAdjustmentEndDate`
  - `registrationListOpenDate`
  - `bracketOpenDate`
  - `description`
  - `isPartnership`
  - `viewCount`
  - `posterImgUrlKey`
  - `status`
  - `createdAt`
  - `updatedAt`
