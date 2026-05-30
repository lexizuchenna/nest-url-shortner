import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'shared/response.dto';

class LinkProperty {
  @ApiProperty({
    example: 'b47f4bba-e068-48f3-95f4-18481041cc74',
    description: 'The shortned url unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'https://lexiz.is-a.dev',
    description: 'The original url shortened url',
  })
  original_url: string;

  @ApiProperty({
    example: 'https://lexiz.is-a.dev',
    description: 'The short url',
  })
  short_url: string;

  @ApiProperty({
    example: 'clhv1234',
    description: 'The links short code',
  })
  short_code: string;

  @ApiProperty({ type: Date, description: 'The creation date' })
  created_at: Date;

  @ApiProperty({ type: Date, description: 'The updated date' })
  updated_at: Date;
}

class CreateLinkData {
  @ApiProperty()
  link: LinkProperty;
}

class GetAllLinksData {
  @ApiProperty({ type: [LinkProperty] })
  links: Array<LinkProperty>;
}

export class CreateLinkRequestDto {
  @ApiProperty({
    example: 'https://lexiz.is-a.dev',
    description: 'The original url to be shortned',
  })
  original_url: string;
}

class ClickTimeline {
  @ApiProperty({ example: '2026-05-30' })
  date: string;

  @ApiProperty({ example: 45 })
  clicks: number;
}

class TopStat {
  @ApiProperty({ example: 'Chrome' })
  name: string;

  @ApiProperty({ example: 120 })
  count: number;
}

class LinkAnalyticsData {
  @ApiProperty({ example: 350 })
  totalClicks: number;

  @ApiProperty({ type: [ClickTimeline] })
  timeline: ClickTimeline[];

  @ApiProperty({ type: [TopStat] })
  referrers: TopStat[];

  @ApiProperty({ type: [TopStat] })
  browsers: TopStat[];
}

export class CreateLinkResponseDto extends BaseResponseDto(CreateLinkData) {}

export class GetAllLinksResDto extends BaseResponseDto(GetAllLinksData) {}

export class GetMetricsResDto extends BaseResponseDto(LinkAnalyticsData) {}

export class DeleteLinkResDto extends BaseResponseDto(CreateLinkData) {}
